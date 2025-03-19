import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User as UserModel } from "@prisma/client";
import { User } from "../user/decorators/user.decorator";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionPlanService } from "./subscription-plan.service";
import { TransactionService } from "./transaction.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { CreateSubscriptionPlanDto } from "./dto/create-subscription-plan.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get("plans")
  async getSubscriptionPlans() {
    return this.subscriptionPlanService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getUserSubscriptions(@User() user: UserModel) {
    return this.subscriptionService.findAllByUserId(user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("active")
  async getActiveSubscription(@User() user: UserModel) {
    return this.subscriptionService.findActiveByUserId(user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async createSubscription(
    @User() user: UserModel,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const plan = await this.subscriptionPlanService.findById(createSubscriptionDto.planId);
    
    if (!plan) {
      throw new Error("Subscription plan not found");
    }

    // Вычисляем дату окончания подписки на основе продолжительности плана
    const startDate = createSubscriptionDto.startDate 
      ? new Date(createSubscriptionDto.startDate) 
      : new Date();
    
    const endDate = createSubscriptionDto.endDate 
      ? new Date(createSubscriptionDto.endDate) 
      : new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    // Создаем подписку
    return this.subscriptionService.create({
      startDate,
      endDate,
      status: "pending",
      user: { connect: { id: user.id } },
      plan: { connect: { id: plan.id } },
    });
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id/cancel")
  async cancelSubscription(
    @User() user: UserModel,
    @Param("id") id: string,
  ) {
    // Проверяем, принадлежит ли подписка текущему пользователю
    const subscription = await this.subscriptionService.findAllByUserId(user.id);
    const userSubscriptionIds = subscription.map((sub) => sub.id);
    
    if (!userSubscriptionIds.includes(id)) {
      throw new Error("Subscription not found");
    }

    return this.subscriptionService.cancelSubscription(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("transactions")
  async getUserTransactions(@User() user: UserModel) {
    return this.transactionService.findAllByUserId(user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("transactions")
  async createTransaction(
    @User() user: UserModel,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.create({
      ...createTransactionDto,
      status: "pending",
      user: { connect: { id: user.id } },
    });
  }

  // Админские endpoints (должны быть защищены ролями)
  @UseGuards(AuthGuard("jwt"))
  @Post("plans")
  async createPlan(@Body() createPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionPlanService.create(createPlanDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("plans/:id")
  async deletePlan(@Param("id") id: string) {
    return this.subscriptionPlanService.delete(id);
  }
} 