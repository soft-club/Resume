import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ClickController } from "./click/click.controller";
import { ClickService } from "./click/click.service";
import { SubscriptionGuard } from "./decorators/has-active-subscription.decorator";
import { PaymeController } from "./payme/payme.controller";
import { PaymeService } from "./payme/payme.service";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionPlanService } from "./subscription-plan.service";
import { TransactionService } from "./transaction.service";

@Module({
  imports: [ConfigModule],
  controllers: [SubscriptionController, PaymentController, PaymeController, ClickController],
  providers: [
    SubscriptionService,
    SubscriptionPlanService,
    TransactionService,
    PaymentService,
    PaymeService,
    SubscriptionGuard,
    ClickService,
  ],
  exports: [
    SubscriptionService,
    SubscriptionPlanService,
    TransactionService,
    PaymentService,
    PaymeService,
    SubscriptionGuard,
    ClickService,
  ],
})
export class SubscriptionModule {}
