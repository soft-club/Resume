import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  paymentId?: string;
}
