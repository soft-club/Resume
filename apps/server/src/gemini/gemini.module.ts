import { Module } from "@nestjs/common";

import { GeminiController } from "./gemini.controller";
import { GeminiService } from "./gemini.service";

@Module({
  providers: [GeminiService],
  controllers: [GeminiController],
  exports: [GeminiService],
})
export class GeminiModule {}
