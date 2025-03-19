import { Body, Controller, Headers, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User as UserModel } from "@prisma/client";

import { User } from "../user/decorators/user.decorator";
import { PaymentService } from "./payment.service";

type CreatePaymentIntentDto = {
  amount: number;
  currency: string;
  description: string;
  subscriptionId?: string;
};

type WebhookRequestBody = {
  id?: string;
  amount?: number;
  currency?: string;
};

type WebhookRequest = {
  body: WebhookRequestBody;
  rawBody?: Buffer;
}

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("create-intent")
  async createPaymentIntent(
    @User() user: UserModel,
    @Body() body: CreatePaymentIntentDto,
  ) {
    return this.paymentService.createPaymentIntent(
      body.amount,
      body.currency,
      body.description,
      user.id,
      body.subscriptionId,
    );
  }

  @Post("webhook")
  async handleWebhook(@Req() req: WebhookRequest, @Headers("stripe-signature") signature: string) {
    // В реальной имплементации здесь должна быть проверка подписи вебхука
    // const event = stripe.webhooks.constructEvent(
    //   req.rawBody,
    //   signature,
    //   this.configService.get("STRIPE_WEBHOOK_SECRET")
    // );

    const requestBody = req.body;

    // Для примера используем моковые данные
    const event = {
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: requestBody.id ?? "pi_mock",
          amount: requestBody.amount ?? 1000,
          currency: requestBody.currency ?? "usd",
          status: "succeeded",
        },
      },
    };

    return this.paymentService.handleWebhook(event);
  }
}
