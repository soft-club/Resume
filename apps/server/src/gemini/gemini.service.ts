import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GeminiService implements OnModuleInit {
  private apiKey!: string;
  private baseUrl!: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.baseUrl =
      this.configService.get<string>("GEMINI_API_URL") ??
      "https://generativelanguage.googleapis.com/v1beta";
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string) {
    const url = `${this.baseUrl}/models/${this.configService.get<string>("GEMINI_MODEL")}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Gemini did not return any choices for your text.");
    }

    return result.candidates[0].content.parts[0].text;
  }

  async improveWriting(text: string): Promise<string> {
    const prompt = `You are an AI writing assistant specialized in writing copy for resumes.
Do not return anything else except the text you improved in the format you received it. It should not begin with a newline. It should not have any prefix or suffix text.
Improve the writing of the following paragraph and returns in the language of the text:

Text: """${text}"""

Revised Text: `;

    return this.generateContent(prompt);
  }

  async fixGrammar(text: string): Promise<string> {
    const prompt = `You are an AI writing assistant specialized in fixing grammar.
Do not return anything else except the text you fixed in the format you received it. It should not begin with a newline. It should not have any prefix or suffix text.
Fix the grammar of the following text and return in the same language:

Text: """${text}"""

Fixed Text: `;

    return this.generateContent(prompt);
  }

  async changeTone(text: string, tone: string): Promise<string> {
    const prompt = `You are an AI writing assistant specialized in changing the tone of text.
Do not return anything else except the modified text in the format you received it. It should not begin with a newline. It should not have any prefix or suffix text.
Change the tone of the following text to be more ${tone} and return in the same language:

Text: """${text}"""

Modified Text: `;

    return this.generateContent(prompt);
  }
}
