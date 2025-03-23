import { z } from "zod";

// Перечисления для Click
export enum ClickError {
  InvalidAmount = -31001,
  InvalidAccount = -31050,
  MethodNotFound = -32601,
  TransactionNotFound = -31003,
  UnableToPerformOperation = -31008,
  TransactionInProgress = -31001,
  AlreadyDone = -31007,
  InsufficientFunds = -31001,
  InvalidJson = -32700,
}

export enum TransactionState {
  Created = 0,
  Completed = 2,
  Cancelled = -1,
  Processing = 1,
}

// Схемы проверки для запросов и уведомлений Click
export const ClickPrepareSchema = z.object({
  click_trans_id: z.string(),
  service_id: z.string(),
  click_paydoc_id: z.string(),
  merchant_trans_id: z.string(),
  amount: z.number(),
  action: z.literal(0),
  sign_time: z.string(),
  sign_string: z.string(),
  error: z.number().optional(),
});

export const ClickCompleteSchema = z.object({
  click_trans_id: z.string(),
  service_id: z.string(),
  click_paydoc_id: z.string(),
  merchant_trans_id: z.string(),
  merchant_prepare_id: z.string().optional(),
  amount: z.number(),
  action: z.literal(1),
  sign_time: z.string(),
  sign_string: z.string(),
  error: z.number().optional(),
});

// Типы для Click API
export type ClickPrepareRequest = z.infer<typeof ClickPrepareSchema>;
export type ClickCompleteRequest = z.infer<typeof ClickCompleteSchema>;

// Типы для Click транзакций
export type ClickTransaction = {
  id: string;
  clickTransId: string;
  clickPaydocId: string;
  merchantTransId: string;
  amount: number;
  state: TransactionState;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

// Ответы для Click API
export type ClickPrepareResponse = {
  click_trans_id: string;
  merchant_trans_id: string;
  merchant_prepare_id: string;
  error: number;
  error_note: string;
};

export type ClickCompleteResponse = {
  click_trans_id: string;
  merchant_trans_id: string;
  merchant_confirm_id: string;
  error: number;
  error_note: string;
}; 