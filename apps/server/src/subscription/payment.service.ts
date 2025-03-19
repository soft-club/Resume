import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TransactionStatus } from "@prisma/client";

import { Config } from "../config/schema";
import { SubscriptionService } from "./subscription.service";
import { TransactionService } from "./transaction.service";

// Заглушка для Stripe SDK (в реальном проекте нужно установить пакет stripe)
type StripePayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
};

@Injectable()
export class PaymentService {
  private readonly stripeEnabled: boolean;
  private readonly stripeSecretKey: string | undefined;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.stripeEnabled = configService.get("STRIPE_ENABLED", { infer: true }) === "true";
    this.stripeSecretKey = configService.get("STRIPE_SECRET_KEY", { infer: true });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    description: string,
    userId: string,
    subscriptionId?: string,
  ) {
    // Проверка, включена ли интеграция с платежной системой
    if (!this.stripeEnabled) {
      throw new Error("Payment integration is not enabled");
    }

    try {
      // В реальном проекте здесь должен быть код для создания платежа в Stripe
      // const stripe = new Stripe(this.stripeSecretKey);
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: Math.round(amount * 100), // Stripe принимает сумму в центах
      //   currency,
      //   description,
      //   metadata: { userId, subscriptionId },
      // });

      // Временная заглушка для демонстрации
      const paymentIntent: StripePayment = {
        id: `pi_${Math.random().toString(36).slice(2, 15)}`,
        amount: amount,
        currency: currency,
        status: "pending",
      };

      // Создаем запись о транзакции в базе данных
      const transaction = await this.transactionService.create({
        amount,
        currency,
        description,
        paymentId: paymentIntent.id,
        paymentMethod: "stripe",
        status: "pending",
        user: { connect: { id: userId } },
      });

      return {
        transactionId: transaction.id,
        paymentIntentId: paymentIntent.id,
        clientSecret: `${paymentIntent.id}_secret_${Math.random().toString(36).slice(2, 10)}`,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async handleWebhook(event: any) {
    try {
      // В реальной интеграции здесь должна быть обработка вебхуков от Stripe
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;

      // Находим транзакцию по ID платежа
      const transaction = await this.transactionService.findById(paymentId);
      if (!transaction) {
        throw new Error(`Transaction not found for payment ID: ${paymentId}`);
      }

      // Обновляем статус транзакции в зависимости от статуса платежа
      switch (event.type) {
        case "payment_intent.succeeded": {
          await this.transactionService.updateStatus(transaction.id, TransactionStatus.completed);

          // Если транзакция связана с подпиской, активируем подписку
          if (transaction.description.includes("Subscription")) {
            const subscriptionId = transaction.description.split("Subscription: ")[1];
            if (subscriptionId) {
              await this.subscriptionService.updateStatus(subscriptionId, "active");
            }
          }
          break;
        }

        case "payment_intent.payment_failed": {
          await this.transactionService.updateStatus(transaction.id, TransactionStatus.failed);
          break;
        }

        case "payment_intent.refunded": {
          await this.transactionService.updateStatus(transaction.id, TransactionStatus.refunded);
          break;
        }

        default: {
          console.log(`Unhandled event type: ${event.type}`);
        }
      }

      return { received: true };
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw new Error(`Failed to process webhook: ${error.message}`);
    }
  }
}
