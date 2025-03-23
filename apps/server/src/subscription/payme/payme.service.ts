import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubscriptionStatus, TransactionStatus } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

import { Config } from "../../config/schema";
import { SubscriptionService } from "../subscription.service";
import { TransactionService } from "../transaction.service";
import {
  PaymeError,
  PaymeMethod,
  PaymeRequest,
  TransactionState,
  CancelReason,
} from "./payme.types";

type PaymeResponse = {
  error?: {
    code: number;
    message: string;
  };
  result?: unknown;
  id?: string;
};

// Тип PaymeTransaction для использования с $queryRaw
type PaymeTransactionRecord = {
  id: string;
  paymeId: string;
  time: number;
  amount: number;
  state: number;
  reason: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

@Injectable()
export class PaymeService {
  private readonly logger = new Logger(PaymeService.name);
  private readonly paymeEnabled: boolean;
  private readonly merchantId: string;
  private readonly merchantKey: string;

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly transactionService: TransactionService,
    private readonly subscriptionService: SubscriptionService,
    private readonly prisma: PrismaService,
  ) {
    this.paymeEnabled = configService.get("PAYME_ENABLED", { infer: true }) === "true";
    this.merchantId = configService.get("PAYME_MERCHANT_ID", { infer: true }) ?? "";
    this.merchantKey = configService.get("PAYME_MERCHANT_KEY", { infer: true }) ?? "";

    if (this.paymeEnabled && (!this.merchantId || !this.merchantKey)) {
      this.logger.error("Payme integration is enabled but merchant credentials are missing");
    }
  }

  verifyAuthorization(authHeader: string): boolean {
    if (!this.paymeEnabled) {
      return false;
    }

    try {
      const [type, credentials] = authHeader.split(" ");

      if (type !== "Basic") {
        return false;
      }

      const decoded = Buffer.from(credentials, "base64").toString("utf8");
      const [username, password] = decoded.split(":");

      return username === this.merchantId && password === this.merchantKey;
    } catch (error) {
      this.logger.error(`Authorization error: ${error.message}`);
      return false;
    }
  }

  generateErrorResponse(id: string | undefined, code: number, message: string): PaymeResponse {
    return {
      error: {
        code,
        message,
      },
      id,
    };
  }

  generateSuccessResponse(id: string | undefined, result: unknown): PaymeResponse {
    return {
      result,
      id,
    };
  }

  async handleRequest(request: PaymeRequest, authorized: boolean): Promise<PaymeResponse> {
    if (!this.paymeEnabled) {
      return this.generateErrorResponse(
        request.id,
        PaymeError.MethodNotFound,
        "Payme integration is not enabled",
      );
    }

    if (!authorized) {
      throw new UnauthorizedException("Invalid merchant credentials");
    }

    try {
      switch (request.method) {
        case PaymeMethod.CheckPerformTransaction: {
          return await this.checkPerformTransaction(request);
        }
        case PaymeMethod.CreateTransaction: {
          return await this.createTransaction(request);
        }
        case PaymeMethod.PerformTransaction: {
          return await this.performTransaction(request);
        }
        case PaymeMethod.CheckTransaction: {
          return await this.checkTransaction(request);
        }
        case PaymeMethod.CancelTransaction: {
          return await this.cancelTransaction(request);
        }
        case PaymeMethod.GetStatement: {
          return await this.getStatement(request);
        }
        default: {
          return this.generateErrorResponse(
            (request as PaymeRequest).id,
            PaymeError.MethodNotFound,
            "Method not found",
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error handling Payme request: ${error.message}`);
      return this.generateErrorResponse(
        request.id,
        PaymeError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  private async createPaymeTransaction(data: {
    paymeId: string;
    time: number;
    amount: number;
    state: number;
    reason: number | null;
    userId: string;
  }) {
    return await this.prisma.$queryRawUnsafe<PaymeTransactionRecord[]>(`
      INSERT INTO "PaymeTransaction" ("paymeId", "time", "amount", "state", "reason", "userId") 
      VALUES ('${data.paymeId}', ${data.time}, ${data.amount}, ${data.state}, ${data.reason === null ? 'NULL' : data.reason}, '${data.userId}')
      RETURNING *
    `).then(rows => rows[0]);
  }

  private async findPaymeTransactionByPaymeId(paymeId: string) {
    return await this.prisma.$queryRawUnsafe<PaymeTransactionRecord[]>(`
      SELECT * FROM "PaymeTransaction" 
      WHERE "paymeId" = '${paymeId}'
      LIMIT 1
    `).then(rows => rows[0] || null);
  }

  private async updatePaymeTransaction(
    id: string,
    data: { state: number; reason?: number | null },
  ) {
    return await this.prisma.$queryRawUnsafe<PaymeTransactionRecord[]>(`
      UPDATE "PaymeTransaction"
      SET "state" = ${data.state}, "reason" = ${data.reason === null ? 'NULL' : data.reason}, "updatedAt" = NOW()
      WHERE "id" = '${id}'
      RETURNING *
    `).then(rows => rows[0]);
  }

  private async getPaymeTransactionsByTimeRange(from: number, to: number) {
    return await this.prisma.$queryRawUnsafe<PaymeTransactionRecord[]>(`
      SELECT * FROM "PaymeTransaction" 
      WHERE "time" >= ${from} AND "time" <= ${to}
      ORDER BY "createdAt" DESC
    `);
  }

  private async checkPerformTransaction(request: PaymeRequest) {
    // Безопасное приведение типа
    const params = request.params as { amount: number; account: { id: string } };
    const amount = params.amount;
    const account = params.account;

    try {
      // Проверяем существование пользователя
      const user = await this.prisma.user.findUnique({
        where: { id: account.id },
      });

      if (!user) {
        return this.generateErrorResponse(request.id, PaymeError.InvalidAccount, "User not found");
      }

      // Проверка, что сумма корректна (больше 0 и в допустимых пределах)
      if (amount <= 0) {
        return this.generateErrorResponse(request.id, PaymeError.InvalidAmount, "Invalid amount");
      }

      return this.generateSuccessResponse(request.id, { allow: true });
    } catch (error) {
      this.logger.error(`CheckPerformTransaction error: ${error.message}`);
      return this.generateErrorResponse(
        request.id,
        PaymeError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  private async createTransaction(request: PaymeRequest) {
    // Безопасное приведение типа
    const params = request.params as {
      id: string;
      time: number;
      amount: number;
      account: { id: string };
    };
    const id = params.id;
    const time = params.time;
    const amount = params.amount;
    const account = params.account;

    try {
      // Проверяем, существует ли уже транзакция с таким ID
      const existingPaymeTransaction = await this.findPaymeTransactionByPaymeId(id);

      if (existingPaymeTransaction) {
        // Если транзакция существует, возвращаем её текущее состояние
        return this.generateSuccessResponse(request.id, {
          create_time: existingPaymeTransaction.createdAt.getTime(),
          transaction: existingPaymeTransaction.id,
          state: existingPaymeTransaction.state,
        });
      }

      // Проверяем существование пользователя
      const user = await this.prisma.user.findUnique({
        where: { id: account.id },
      });

      if (!user) {
        return this.generateErrorResponse(request.id, PaymeError.InvalidAccount, "User not found");
      }

      // Создаем новую транзакцию Payme
      const paymeTransaction = await this.createPaymeTransaction({
        paymeId: id,
        time,
        amount: amount / 100, // Payme передает сумму в тийинах (1/100 сума)
        state: TransactionState.Created,
        reason: null,
        userId: user.id,
      });

      // Создаем запись о транзакции в основной таблице транзакций
      await this.transactionService.create({
        amount: amount / 100,
        currency: "UZS",
        description: `Subscription payment via Payme: ${id}`,
        paymentId: paymeTransaction.id,
        paymentMethod: "payme",
        status: "pending",
        user: { connect: { id: user.id } },
      });

      return this.generateSuccessResponse(request.id, {
        create_time: paymeTransaction.createdAt.getTime(),
        transaction: paymeTransaction.id,
        state: paymeTransaction.state,
      });
    } catch (error) {
      this.logger.error(`CreateTransaction error: ${error.message}`);
      return this.generateErrorResponse(
        request.id,
        PaymeError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  private async performTransaction(request: PaymeRequest) {
    // Безопасное приведение типа
    const params = request.params as { id: string };
    const id = params.id;

    try {
      // Находим транзакцию Payme
      const paymeTransaction = await this.findPaymeTransactionByPaymeId(id);

      if (!paymeTransaction) {
        return this.generateErrorResponse(
          request.id,
          PaymeError.TransactionNotFound,
          "Transaction not found",
        );
      }

      // Проверяем состояние транзакции
      if ((paymeTransaction.state as TransactionState) === TransactionState.Completed) {
        // Если транзакция уже выполнена, возвращаем успешный результат
        return this.generateSuccessResponse(request.id, {
          transaction: paymeTransaction.id,
          perform_time: paymeTransaction.updatedAt.getTime(),
          state: paymeTransaction.state,
        });
      }

      if ((paymeTransaction.state as TransactionState) !== TransactionState.Created) {
        // Если транзакция не в состоянии "создана", возвращаем ошибку
        return this.generateErrorResponse(
          request.id,
          PaymeError.UnableToPerformOperation,
          "Transaction state is invalid",
        );
      }

      // Обновляем состояние транзакции Payme
      const updatedPaymeTransaction = await this.updatePaymeTransaction(paymeTransaction.id, {
        state: TransactionState.Completed,
      });

      // Находим и обновляем соответствующую транзакцию в основной таблице
      const transaction = await this.prisma.transaction.findFirst({
        where: { paymentId: paymeTransaction.id },
      });

      if (transaction) {
        await this.transactionService.updateStatus(transaction.id, TransactionStatus.completed);

        // Активируем подписку, если транзакция связана с подпиской
        if (transaction.description.includes("Subscription")) {
          const subscriptionId = transaction.description.split(
            "Subscription payment via Payme: ",
          )[1];
          if (subscriptionId) {
            await this.subscriptionService.updateStatus(
              subscriptionId,
              "active" as SubscriptionStatus,
            );
          }
        }
      }

      return this.generateSuccessResponse(request.id, {
        transaction: updatedPaymeTransaction.id,
        perform_time: updatedPaymeTransaction.updatedAt.getTime(),
        state: updatedPaymeTransaction.state,
      });
    } catch (error) {
      this.logger.error(`PerformTransaction error: ${error.message}`);
      return this.generateErrorResponse(
        request.id,
        PaymeError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  private async checkTransaction(request: PaymeRequest) {
    // Безопасное приведение типа
    const params = request.params as { id: string };
    const id = params.id;

    try {
      // Находим транзакцию Payme
      const paymeTransaction = await this.findPaymeTransactionByPaymeId(id);

      if (!paymeTransaction) {
        return this.generateErrorResponse(
          request.id,
          PaymeError.TransactionNotFound,
          "Transaction not found",
        );
      }

      // Возвращаем информацию о транзакции
      const response = {
        create_time: paymeTransaction.createdAt.getTime(),
        perform_time: paymeTransaction.updatedAt.getTime(),
        cancel_time: null,
        transaction: paymeTransaction.id,
        state: paymeTransaction.state,
        reason: paymeTransaction.reason,
      };

      return this.generateSuccessResponse(request.id, response);
    } catch (error) {
      this.logger.error(`CheckTransaction error: ${error.message}`);
      return this.generateErrorResponse(
        request.id,
        PaymeError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  private async cancelTransaction(request: PaymeRequest) {
    // Безопасное приведение типа
    const params = request.params as { id: string; reason: number };
    const id = params.id;
    const reason = params.reason;

    try {
      // Находим транзакцию Payme
      const paymeTransaction = await this.findPaymeTransactionByPaymeId(id);

      if (!paymeTransaction) {
        return this.generateErrorResponse(
          request.id,
          PaymeError.TransactionNotFound,
          "Transaction not found",
        );
      }

      // Проверяем, можно ли отменить транзакцию
      let newState: TransactionState;

      if ((paymeTransaction.state as TransactionState) === TransactionState.Created) {
        newState = TransactionState.Cancelled;
      } else if ((paymeTransaction.state as TransactionState) === TransactionState.Completed) {
        newState = TransactionState.CancelledAfterComplete;
      } else {
        // Если транзакция уже отменена, возвращаем её текущее состояние
        return this.generateSuccessResponse(request.id, {
          transaction: paymeTransaction.id,
          cancel_time: paymeTransaction.updatedAt.getTime(),
          state: paymeTransaction.state,
        });
      }

      // Обновляем состояние транзакции Payme
      const updatedPaymeTransaction = await this.updatePaymeTransaction(paymeTransaction.id, {
        state: newState,
        reason: reason as unknown as number | null,
      });

      // Находим и обновляем соответствующую транзакцию в основной таблице
      const transaction = await this.prisma.transaction.findFirst({
        where: { paymentId: paymeTransaction.id },
      });

      if (transaction) {
        await this.transactionService.updateStatus(transaction.id, TransactionStatus.failed);

        // Деактивируем подписку, если транзакция связана с подпиской и она была ранее активирована
        if (
          transaction.description.includes("Subscription") &&
          newState === TransactionState.CancelledAfterComplete
        ) {
          const subscriptionId = transaction.description.split(
            "Subscription payment via Payme: ",
          )[1];
          if (subscriptionId) {
            await this.subscriptionService.updateStatus(
              subscriptionId,
              "cancelled" as SubscriptionStatus,
            );
          }
        }
      }

      return this.generateSuccessResponse(request.id, {
        transaction: updatedPaymeTransaction.id,
        cancel_time: updatedPaymeTransaction.updatedAt.getTime(),
        state: updatedPaymeTransaction.state,
      });
    } catch (error) {
      this.logger.error(`CancelTransaction error: ${error.message}`);
      return this.generateErrorResponse(
        request.id,
        PaymeError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  private async getStatement(request: PaymeRequest) {
    // Безопасное приведение типа
    const params = request.params as { from: number; to: number };
    const from = params.from;
    const to = params.to;

    try {
      // Получаем все транзакции за указанный период
      const transactions = await this.getPaymeTransactionsByTimeRange(from, to);

      // Формируем список транзакций для ответа
      const transactionsList = transactions.map((tx) => ({
        id: tx.paymeId,
        time: tx.time,
        amount: tx.amount * 100, // Переводим обратно в тийины
        account: {
          id: tx.userId,
        },
        create_time: tx.createdAt.getTime(),
        perform_time: tx.state === 2 ? tx.updatedAt.getTime() : 0,
        cancel_time:
          tx.state === -1 || tx.state === -2
            ? tx.updatedAt.getTime()
            : 0,
        transaction: tx.id,
        state: tx.state,
        reason: tx.reason,
      }));

      return this.generateSuccessResponse(request.id, {
        transactions: transactionsList,
      });
    } catch (error) {
      this.logger.error(`GetStatement error: ${error.message}`);
      return this.generateErrorResponse(
        request.id,
        PaymeError.UnableToPerformOperation,
        error.message,
      );
    }
  }

  // Метод для создания чекаута Payme
  createPaymentUrl(amount: number, userId: string, redirectUrl?: string): string {
    if (!this.paymeEnabled) {
      throw new Error("Payme integration is not enabled");
    }

    const checkoutUrl = this.configService.get("PAYME_CHECKOUT_URL", { infer: true });
    const merchantId = this.merchantId;

    // Формируем объект с данными заказа
    const orderData = {
      merchant: merchantId,
      amount: amount * 100, // Переводим в тийины (1/100 сума)
      account: {
        id: userId,
      },
      callback: redirectUrl ?? this.configService.get("PUBLIC_URL", { infer: true }),
      lang: "ru",
    };

    // Формируем URL для Payme checkout
    const orderDataEncoded = Buffer.from(JSON.stringify(orderData)).toString("base64");
    return `${checkoutUrl}/${orderDataEncoded}`;
  }
}
