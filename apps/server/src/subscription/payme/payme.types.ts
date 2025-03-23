import { z } from "zod";

// Перечисления для Payme
export enum PaymeMethod {
  CheckPerformTransaction = "CheckPerformTransaction",
  CreateTransaction = "CreateTransaction",
  PerformTransaction = "PerformTransaction",
  CancelTransaction = "CancelTransaction",
  CheckTransaction = "CheckTransaction",
  GetStatement = "GetStatement",
}

export enum PaymeError {
  InvalidAmount = -31_001,
  InvalidAccount = -31_050,
  MethodNotFound = -32_601,
  TransactionNotFound = -31_003,
  UnableToPerformOperation = -31_008,
  TransactionInProgress = -31_001,
  AlreadyDone = -31_007,
  InsufficientFunds = -31_001,
  InvalidJson = -32_700,
}

export enum TransactionState {
  Created = 1,
  Completed = 2,
  Cancelled = -1,
  CancelledAfterComplete = -2,
}

export enum CancelReason {
  UserRefund = 1,
  SystemRefund = 2,
  PaymentFailed = 3,
}

// Схемы валидации данных
export const AccountSchema = z.object({
  id: z.string(),
});

export const CheckPerformRequestSchema = z.object({
  id: z.string().optional(),
  method: z.literal(PaymeMethod.CheckPerformTransaction),
  params: z.object({
    amount: z.number(),
    account: AccountSchema,
  }),
});

export const CreateTransactionRequestSchema = z.object({
  id: z.string().optional(),
  method: z.literal(PaymeMethod.CreateTransaction),
  params: z.object({
    id: z.string(),
    time: z.number(),
    amount: z.number(),
    account: AccountSchema,
  }),
});

export const PerformTransactionRequestSchema = z.object({
  id: z.string().optional(),
  method: z.literal(PaymeMethod.PerformTransaction),
  params: z.object({
    id: z.string(),
  }),
});

export const CheckTransactionRequestSchema = z.object({
  id: z.string().optional(),
  method: z.literal(PaymeMethod.CheckTransaction),
  params: z.object({
    id: z.string(),
  }),
});

export const CancelTransactionRequestSchema = z.object({
  id: z.string().optional(),
  method: z.literal(PaymeMethod.CancelTransaction),
  params: z.object({
    id: z.string(),
    reason: z.number(),
  }),
});

export const GetStatementRequestSchema = z.object({
  id: z.string().optional(),
  method: z.literal(PaymeMethod.GetStatement),
  params: z.object({
    from: z.number(),
    to: z.number(),
  }),
});

// Типы для Payme API
export type PaymeAccount = z.infer<typeof AccountSchema>;

export type CheckPerformRequest = z.infer<typeof CheckPerformRequestSchema>;
export type CreateTransactionRequest = z.infer<typeof CreateTransactionRequestSchema>;
export type PerformTransactionRequest = z.infer<typeof PerformTransactionRequestSchema>;
export type CheckTransactionRequest = z.infer<typeof CheckTransactionRequestSchema>;
export type CancelTransactionRequest = z.infer<typeof CancelTransactionRequestSchema>;
export type GetStatementRequest = z.infer<typeof GetStatementRequestSchema>;

export type PaymeRequest =
  | CheckPerformRequest
  | CreateTransactionRequest
  | PerformTransactionRequest
  | CheckTransactionRequest
  | CancelTransactionRequest
  | GetStatementRequest;

// Типы для Payme транзакций
export type PaymeTransaction = {
  id: string;
  paymeId: string;
  time: number;
  amount: number;
  state: TransactionState;
  reason: CancelReason | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
