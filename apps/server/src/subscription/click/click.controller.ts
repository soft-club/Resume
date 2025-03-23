import { Body, Controller, Get, Post, Res, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { Public } from "../../auth/decorators/public.decorator";
import { Config } from "../../config/schema";
import { ClickService } from "./click.service";
import { ClickCompleteRequest, ClickPrepareRequest, ClickCompleteSchema, ClickPrepareSchema } from "./click.types";

@ApiTags("click")
@Controller("click")
export class ClickController {
  constructor(
    private readonly clickService: ClickService,
    private readonly configService: ConfigService<Config>,
  ) {}

  // Обработка запроса Prepare от Click
  @Public()
  @Post("prepare")
  async prepare(
    @Body(new ValidationPipe({ transform: true })) body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    // Валидируем данные запроса
    const parseResult = ClickPrepareSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: -31050,
        error_note: "Invalid request data",
      });
    }

    // Обрабатываем запрос
    const response = await this.clickService.handlePrepareRequest(parseResult.data);
    return res.status(200).json(response);
  }

  // Обработка запроса Complete от Click
  @Public()
  @Post("complete")
  async complete(
    @Body(new ValidationPipe({ transform: true })) body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    // Валидируем данные запроса
    const parseResult = ClickCompleteSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: -31050,
        error_note: "Invalid request data",
      });
    }

    // Обрабатываем запрос
    const response = await this.clickService.handleCompleteRequest(parseResult.data);
    return res.status(200).json(response);
  }

  // Для тестирования доступности эндпоинтов
  @Public()
  @Get("status")
  status() {
    return {
      status: "ok",
      enabled: this.configService.get("CLICK_ENABLED", { infer: true }) === "true",
    };
  }
} 