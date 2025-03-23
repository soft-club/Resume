import { z } from "zod";

export const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),

  // Ports
  PORT: z.coerce.number().default(3000),

  // URLs
  PUBLIC_URL: z.string().url(),
  STORAGE_URL: z.string().url(),

  // Database (Prisma)
  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  // Authentication Secrets
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  // Browser
  CHROME_TOKEN: z.string(),
  CHROME_URL: z.string().url(),
  CHROME_IGNORE_HTTPS_ERRORS: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),

  // Mail Server
  MAIL_FROM: z.string().includes("@").optional().default("noreply@localhost"),
  SMTP_URL: z
    .string()
    .url()
    .refine((url) => url.startsWith("smtp://") || url.startsWith("smtps://"))
    .optional(),

  // Storage
  STORAGE_ENDPOINT: z.string(),
  STORAGE_PORT: z.coerce.number(),
  STORAGE_REGION: z.string().default("us-east-1"),
  STORAGE_BUCKET: z.string(),
  STORAGE_ACCESS_KEY: z.string(),
  STORAGE_SECRET_KEY: z.string(),
  STORAGE_USE_SSL: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),
  STORAGE_SKIP_BUCKET_CHECK: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),

  // Feature Flags (Optional)
  DISABLE_SIGNUPS: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),
  DISABLE_EMAIL_AUTH: z
    .string()
    .default("false")
    .transform((s) => s !== "false" && s !== "0"),

  // GitHub (OAuth, Optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().url().optional(),

  // Google (OAuth, Optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),

  // OpenID (Optional)
  VITE_OPENID_NAME: z.string().optional(),
  OPENID_AUTHORIZATION_URL: z.string().url().optional(),
  OPENID_CALLBACK_URL: z.string().url().optional(),
  OPENID_CLIENT_ID: z.string().optional(),
  OPENID_CLIENT_SECRET: z.string().optional(),
  OPENID_ISSUER: z.string().optional(),
  OPENID_SCOPE: z.string().optional(),
  OPENID_TOKEN_URL: z.string().url().optional(),
  OPENID_USER_INFO_URL: z.string().url().optional(),

  // Payment Integration
  STRIPE_ENABLED: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  // Payme Integration
  PAYME_ENABLED: z.enum(["true", "false"]).default("false"),
  PAYME_MERCHANT_ID: z.string().optional(),
  PAYME_MERCHANT_KEY: z.string().optional(),
  PAYME_CHECKOUT_URL: z.string().default("https://checkout.paycom.uz"),
  PAYME_API_URL: z.string().default("https://checkout.paycom.uz/api"),

  EMAIL_VERIFICATION_TOKEN_SECRET: z.string().default("email-verification-token-secret"),

  CLICK_ENABLED: z.enum(["true", "false"]).default("false"),
  CLICK_MERCHANT_ID: z.string().optional(),
  CLICK_SERVICE_ID: z.string().optional(),
  CLICK_SECRET_KEY: z.string().optional(),
  CLICK_API_URL: z.string().default("https://api.click.uz/v2/merchant"),
});

export type Config = z.infer<typeof configSchema>;
