import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateSubscriptionPlanDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number; // в днях

  @IsOptional()
  @IsObject()
  features?: Record<string, any>;
}
