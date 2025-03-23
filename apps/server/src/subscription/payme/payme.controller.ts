import { Body, Controller, Headers, Post, Req, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { PaymeService } from "./payme.service";
import { PaymeMethod, PaymeRequest } from "./payme.types";

@Controller("api/payme")
export class PaymeController {
  constructor(private readonly paymeService: PaymeService) {}

  @Post()
  async handlePaymeRequest(
    @Body() request: PaymeRequest,
    @Headers("authorization") authorizationHeader: string,
    @Req() req: Request,
  ) {
    // Проверка авторизации запроса
    const isAuthorized = this.paymeService.verifyAuthorization(authorizationHeader);

    if (!isAuthorized && request.method !== PaymeMethod.GetStatement) {
      throw new UnauthorizedException("Invalid merchant credentials");
    }

    return this.paymeService.handleRequest(request, isAuthorized);
  }
}
