import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const createSubscriptionPlanSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number(),
  currency: z.string().optional(),
  duration: z.number(), // в днях
  features: z.record(z.unknown()).optional(),
});

export class CreateSubscriptionPlanDto extends createZodDto(createSubscriptionPlanSchema) {}
