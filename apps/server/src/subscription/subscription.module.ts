import { Module } from "@nestjs/common";

import { SubscriptionGuard } from "./decorators/has-active-subscription.decorator";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionPlanService } from "./subscription-plan.service";
import { TransactionService } from "./transaction.service";

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
