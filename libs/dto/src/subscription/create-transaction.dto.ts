import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number(),
  currency: z.string().optional(),
  description: z.string().min(1),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
});

export class CreateTransactionDto extends createZodDto(createTransactionSchema) {}
