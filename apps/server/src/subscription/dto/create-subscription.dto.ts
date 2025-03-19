import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  planId: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
