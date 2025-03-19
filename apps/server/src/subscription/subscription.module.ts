import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionPlanService } from "./subscription-plan.service";
import { TransactionService } from "./transaction.service";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { SubscriptionGuard } from "./decorators/has-active-subscription.decorator";

@Module({
  controllers: [SubscriptionController, PaymentController],
  providers: [
    SubscriptionService,
    SubscriptionPlanService,
    TransactionService,
    PaymentService,
    SubscriptionGuard,
  ],
  exports: [
    SubscriptionService,
    SubscriptionPlanService,
    TransactionService,
    PaymentService,
    SubscriptionGuard,
  ],
})
export class SubscriptionModule {} 