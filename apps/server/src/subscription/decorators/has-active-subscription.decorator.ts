import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { SubscriptionService } from "../subscription.service";

// Ключ для метаданных
export const HAS_ACTIVE_SUBSCRIPTION_KEY = "hasActiveSubscription";

// Метаданные для роута
export const RequireActiveSubscription = () => SetMetadata(HAS_ACTIVE_SUBSCRIPTION_KEY, true);

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredSubscription = this.reflector.getAllAndOverride<boolean>(
      HAS_ACTIVE_SUBSCRIPTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Если проверка подписки не требуется для этого маршрута
    if (!requiredSubscription) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Проверяем наличие пользователя (должен быть добавлен AuthGuard перед этим)
    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }

    // Проверяем наличие активной подписки
    const hasActiveSubscription = await this.subscriptionService.hasActiveSubscription(user.id);

    if (!hasActiveSubscription) {
      throw new UnauthorizedException("Active subscription required");
    }

    return true;
  }
}

// Комбинированный декоратор для использования в контроллерах
export function HasActiveSubscription() {
  return applyDecorators(
    UseGuards(AuthGuard("jwt"), SubscriptionGuard),
    RequireActiveSubscription(),
  );
}
