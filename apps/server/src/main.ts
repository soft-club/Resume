import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import { patchNestJsSwagger } from "nestjs-zod";
import { PrismaService } from "nestjs-prisma";
import { SubscriptionPlanService } from "./subscription/subscription-plan.service";

import { AppModule } from "./app.module";
import type { Config } from "./config/schema";

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === "development" ? ["debug"] : ["error", "warn", "log"],
  });

  const configService = app.get(ConfigService<Config>);

  const accessTokenSecret = configService.getOrThrow("ACCESS_TOKEN_SECRET");
  const publicUrl = configService.getOrThrow("PUBLIC_URL");
  const isHTTPS = publicUrl.startsWith("https://") ?? false;

  // Cookie Parser
  app.use(cookieParser());

  // Session
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: accessTokenSecret,
      cookie: { httpOnly: true, secure: isHTTPS },
    }),
  );

  // CORS
  app.enableCors({ credentials: true, origin: isHTTPS });

  // Helmet - enabled only in production
  if (isHTTPS) app.use(helmet({ contentSecurityPolicy: false }));

  // Global Prefix
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);

  // Enable Shutdown Hooks
  app.enableShutdownHooks();

  // Swagger (OpenAPI Docs)
  // This can be accessed by visiting {SERVER_URL}/api/docs
  const config = new DocumentBuilder()
    .setTitle("Reactive Resume")
    .setDescription(
      "Reactive Resume is a free and open source resume builder that's built to make the mundane tasks of creating, updating and sharing your resume as easy as 1, 2, 3.",
    )
    .addCookieAuth("Authentication", { type: "http", in: "cookie", scheme: "Bearer" })
    .setVersion("4.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // Инициализация тестовых планов подписки, если их нет
  try {
    const prismaService = app.get(PrismaService);
    const subscriptionPlanService = app.get(SubscriptionPlanService);

    // Проверяем, существуют ли уже планы
    const existingPlans = await prismaService.subscriptionPlan.count();

    if (existingPlans === 0) {
      // Создаем базовые планы подписки
      await subscriptionPlanService.create({
        name: "Basic",
        description: "Essential features for creating basic resumes",
        price: 4.99,
        currency: "USD",
        duration: 30, // 1 месяц
        features: {
          "Unlimited Resumes": true,
          "Premium Templates": false,
          "PDF Exports": true,
          "Remove Watermark": false,
          "Priority Support": false,
        },
      });

      await subscriptionPlanService.create({
        name: "Professional",
        description: "Advanced features for job seekers",
        price: 9.99,
        currency: "USD",
        duration: 30, // 1 месяц
        features: {
          "Unlimited Resumes": true,
          "Premium Templates": true,
          "PDF Exports": true,
          "Remove Watermark": true,
          "Priority Support": false,
        },
      });

      await subscriptionPlanService.create({
        name: "Enterprise",
        description: "Complete package with all premium features",
        price: 99.99,
        currency: "USD",
        duration: 365, // 1 год
        features: {
          "Unlimited Resumes": true,
          "Premium Templates": true,
          "PDF Exports": true,
          "Remove Watermark": true,
          "Priority Support": true,
        },
      });

      console.log("Created default subscription plans");
    }
  } catch (error) {
    console.error("Error creating subscription plans:", error);
  }

  // Port
  const port = configService.get<number>("PORT") ?? 3000;

  await app.listen(port);

  Logger.log(`🚀 Server is up and running on port ${port}`, "Bootstrap");
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void bootstrap();
