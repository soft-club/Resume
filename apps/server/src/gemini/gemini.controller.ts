import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { GeminiService } from "./gemini.service";

const TextSchema = z.object({
  text: z.string().min(1).max(5000),
});

const ToneSchema = TextSchema.extend({
  tone: z.enum(["casual", "professional", "confident", "friendly"]),
});

class TextDto extends createZodDto(TextSchema) {}
class ToneDto extends createZodDto(ToneSchema) {}

@Controller("gemini")
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post("improve-writing")
  async improveWriting(@Body() { text }: TextDto) {
    return { text: await this.geminiService.improveWriting(text) };
  }

  @Post("fix-grammar")
  async fixGrammar(@Body() { text }: TextDto) {
    return { text: await this.geminiService.fixGrammar(text) };
  }

  @Post("change-tone")
  async changeTone(@Body() { text, tone }: ToneDto) {
    return { text: await this.geminiService.changeTone(text, tone) };
  }
}
