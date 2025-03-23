import * as crypto from "node:crypto";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubscriptionStatus } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

import { Config } from "../../config/schema";
import { SubscriptionService } from "../subscription.service";
import { TransactionService } from "../transaction.service";
import {
  ClickCompleteRequest,
  ClickCompleteResponse,
  ClickError,
  ClickPrepareRequest,
  ClickPrepareResponse,
  TransactionState,
} from "./click.types";

// Временный интерфейс для Click транзакций до обновления Prisma клиента
type ClickTransactionRecord = {
  id: string;
  clickTransId: string;
  clickPaydocId: string;
  merchantTransId: string;
  amount: number;
  state: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

@Injectable()
export class ClickService {
  private readonly logger = new Logger(ClickService.name);
  private readonly clickEnabled: boolean;
  private readonly merchantId: string;
  private readonly serviceId: string;
  private readonly secretKey: string;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionService: SubscriptionService,
    private readonly prisma: PrismaService,
  ) {
    this.clickEnabled = configService.get("CLICK_ENABLED", { infer: true }) === "true";
    this.merchantId = configService.get("CLICK_MERCHANT_ID", { infer: true }) ?? "";
    this.serviceId = configService.get("CLICK_SERVICE_ID", { infer: true }) ?? "";
    this.secretKey = configService.get("CLICK_SECRET_KEY", { infer: true }) ?? "";

    if (this.clickEnabled && (!this.merchantId || !this.serviceId || !this.secretKey)) {
      this.logger.error("Click integration is enabled but credentials are missing");
    }
  }

  // Проверка подписи запроса от Click
  verifySignature(params: {
    sign_string: string;
    sign_time: string;
    merchant_trans_id: string;
    service_id: string;
    click_trans_id: string;
    merchant_prepare_id?: string;
    amount: number;
    action: number;
  }): boolean {
    if (!this.clickEnabled) {
      return false;
    }

    try {
      const { sign_string, sign_time, ...rest } = params;

      // Формируем строку для подписи
      // merchant_trans_id + service_id + click_trans_id + merchant_prepare_id + amount + action + sign_time + secret_key
      const signData = [
        rest.merchant_trans_id,
        rest.service_id,
        rest.click_trans_id,
        rest.merchant_prepare_id ?? "",
        rest.amount,
        rest.action,
        sign_time,
        this.secretKey,
      ].join("");

      // Хеширование строки с HMAC-SHA256
      const calculatedSignature = crypto.createHash("md5").update(signData).digest("hex");

      return calculatedSignature === sign_string;
    } catch (error) {
      this.logger.error(`Signature verification error: ${error.message}`);
      return false;
    }
  }

  // Обработка запроса на подготовку транзакции (Prepare)
  async handlePrepareRequest(request: ClickPrepareRequest): Promise<ClickPrepareResponse> {
    if (!this.clickEnabled) {
      return this.generateErrorResponse(
        request.click_trans_id,
        request.merchant_trans_id,
        ClickError.MethodNotFound,
        "Click integration is not enabled",
      );
    }

    // Проверка подписи
    if (!this.verifySignature(request)) {
      return this.generateErrorResponse(
        request.click_trans_id,
        request.merchant_trans_id,
        ClickError.InvalidAccount,
        "Invalid signature",
      );
    }

    try {
      // Разбор merchant_trans_id для получения информации о подписке
      // Ожидаем формат subscription_planId_timestamp
      const parts = request.merchant_trans_id.split("_");
      if (parts.length !== 3 || parts[0] !== "subscription") {
        return this.generateErrorResponse(
          request.click_trans_id,
          request.merchant_trans_id,
          ClickError.InvalidAccount,
          "Invalid merchant_trans_id format",
        );
      }

      const planId = parts[1];

      // Извлекаем userId из параметров транзакции
      // В реальном приложении здесь будет логика получения userId
      // Сейчас просто используем демонстрационный ID
      const userId = "demo_user_id";

      // Проверяем существование пользователя
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return this.generateErrorResponse(
          request.click_trans_id,
          request.merchant_trans_id,
          ClickError.InvalidAccount,
          "User not found",
        );
      }

      // Проверка суммы
      if (request.amount <= 0) {
        return this.generateErrorResponse(
          request.click_trans_id,
          request.merchant_trans_id,
          ClickError.InvalidAmount,
          "Invalid amount",
        );
      }

      // Создаем транзакцию Click
      const clickTransaction = await this.prisma
        .$queryRawUnsafe<ClickTransactionRecord[]>(
          `
        INSERT INTO "ClickTransaction" ("clickTransId", "clickPaydocId", "merchantTransId", "amount", "state", "userId") 
        VALUES ('${request.click_trans_id}', '${request.click_paydoc_id}', '${request.merchant_trans_id}', ${request.amount}, ${TransactionState.Created}, '${userId}')
        RETURNING *
      `,
        )
        .then((rows) => rows[0]);

      // Возвращаем успешный ответ
      return {
        click_trans_id: request.click_trans_id,
        merchant_trans_id: request.merchant_trans_id,
        merchant_prepare_id: clickTransaction.id,
        error: 0,
        error_note: "Success",
      };
    } catch (error) {
      this.logger.error(`Prepare request error: ${error.message}`);
      return this.generateErrorResponse(
        request.click_trans_id,
        request.merchant_trans_id,
        ClickError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  // Обработка запроса на завершение транзакции (Complete)
  async handleCompleteRequest(request: ClickCompleteRequest): Promise<ClickCompleteResponse> {
    if (!this.clickEnabled) {
      return this.generateCompleteErrorResponse(
        request.click_trans_id,
        request.merchant_trans_id,
        ClickError.MethodNotFound,
        "Click integration is not enabled",
      );
    }

    // Проверка подписи
    if (!this.verifySignature(request)) {
      return this.generateCompleteErrorResponse(
        request.click_trans_id,
        request.merchant_trans_id,
        ClickError.InvalidAccount,
        "Invalid signature",
      );
    }

    try {
      // Находим транзакцию по merchant_prepare_id
      const clickTransactions = await this.prisma
        .$queryRawUnsafe<ClickTransactionRecord[]>(
          `
        SELECT * FROM "ClickTransaction" 
        WHERE "id" = '${request.merchant_prepare_id}'
        AND "clickTransId" = '${request.click_trans_id}'
        AND "merchantTransId" = '${request.merchant_trans_id}'
        LIMIT 1
      `,
        );
      
      if (clickTransactions.length === 0) {
        return this.generateCompleteErrorResponse(
          request.click_trans_id,
          request.merchant_trans_id,
          ClickError.TransactionNotFound,
          "Transaction not found",
        );
      }
      
      const clickTransaction = clickTransactions[0];
      
      // Проверяем состояние транзакции
      if (clickTransaction.state === 2) {
        // Если транзакция уже выполнена, возвращаем успешный результат
        return {
          click_trans_id: request.click_trans_id,
          merchant_trans_id: request.merchant_trans_id,
          merchant_confirm_id: clickTransaction.id,
          error: 0,
          error_note: "Success",
        };
      }

      if (clickTransaction.state !== 0) {
        // Если транзакция не в состоянии "создана", возвращаем ошибку
        return this.generateCompleteErrorResponse(
          request.click_trans_id,
          request.merchant_trans_id,
          ClickError.UnableToPerformOperation,
          "Transaction state is invalid",
        );
      }

      // Обновляем состояние транзакции Click
      const updatedClickTransaction = await this.prisma
        .$queryRawUnsafe<ClickTransactionRecord[]>(
          `
        UPDATE "ClickTransaction"
        SET "state" = ${TransactionState.Completed}, "updatedAt" = NOW()
        WHERE "id" = '${clickTransaction.id}'
        RETURNING *
      `,
        )
        .then((rows) => rows[0]);

      // Создаем запись о транзакции в основной таблице транзакций
      const transaction = await this.transactionService.create({
        amount: request.amount,
        currency: "UZS",
        description: `Subscription payment via Click: ${request.merchant_trans_id}`,
        paymentId: clickTransaction.id,
        paymentMethod: "click",
        status: "completed",
        user: { connect: { id: clickTransaction.userId } },
      });

      // Разбор merchant_trans_id для получения информации о подписке
      const parts = request.merchant_trans_id.split("_");
      if (parts.length >= 2 && parts[0] === "subscription") {
        const planId = parts[1];

        // Логика создания или обновления подписки
        // В реальном приложении здесь будет код для создания/обновления подписки
        // Для демонстрации предполагаем, что подписка уже существует и нужно её активировать
        const subscription = await this.subscriptionService.findActiveByUserId(
          clickTransaction.userId,
        );
        if (subscription) {
          await this.subscriptionService.updateStatus(
            subscription.id,
            "active" as SubscriptionStatus,
          );
        } else {
          // Создание новой подписки если нужно
          // Код для создания подписки
        }
      }

      // Возвращаем успешный ответ
      return {
        click_trans_id: request.click_trans_id,
        merchant_trans_id: request.merchant_trans_id,
        merchant_confirm_id: updatedClickTransaction.id,
        error: 0,
        error_note: "Success",
      };
    } catch (error) {
      this.logger.error(`Complete request error: ${error.message}`);
      return this.generateCompleteErrorResponse(
        request.click_trans_id,
        request.merchant_trans_id,
        ClickError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  // Генерация ответа с ошибкой для Prepare запроса
  private generateErrorResponse(
    clickTransId: string,
    merchantTransId: string,
    errorCode: number,
    errorNote: string,
  ): ClickPrepareResponse {
    return {
      click_trans_id: clickTransId,
      merchant_trans_id: merchantTransId,
      merchant_prepare_id: "",
      error: errorCode,
      error_note: errorNote,
    };
  }

  // Генерация ответа с ошибкой для Complete запроса
  private generateCompleteErrorResponse(
    clickTransId: string,
    merchantTransId: string,
    errorCode: number,
    errorNote: string,
  ): ClickCompleteResponse {
    return {
      click_trans_id: clickTransId,
      merchant_trans_id: merchantTransId,
      merchant_confirm_id: "",
      error: errorCode,
      error_note: errorNote,
    };
  }

  // Метод для создания чекаута Click
  createPaymentUrl(amount: number, userId: string, planId: string, redirectUrl?: string): string {
    if (!this.clickEnabled) {
      throw new Error("Click integration is not enabled");
    }

    // Генерируем merchant_trans_id
    const merchantTransId = `subscription_${planId}_${Date.now()}`;

    // Формируем URL для Click checkout
    return `https://my.click.uz/services/pay?service_id=${this.serviceId}&merchant_id=${this.merchantId}&amount=${amount}&transaction_param=${merchantTransId}&return_url=${redirectUrl ?? this.configService.get("PUBLIC_URL", { infer: true })}`;
  }
}
