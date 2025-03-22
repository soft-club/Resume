import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const createSubscriptionSchema = z.object({
  planId: z.string().min(1),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export class CreateSubscriptionDto extends createZodDto(createSubscriptionSchema) {}
