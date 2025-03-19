import { z } from "zod";

import { basicsSchema, defaultBasics } from "./basics";
import { defaultMetadata, metadataSchema } from "./metadata";
import type { ResumeVariant } from "./sections";
import { getSectionsByVariant, sectionsSchema } from "./sections";

// Schema
export const resumeDataSchema = z.object({
  basics: basicsSchema,
  sections: sectionsSchema,
  metadata: metadataSchema,
});

// Type
export type ResumeData = z.infer<typeof resumeDataSchema>;

export const getResumeData = (variant: ResumeVariant = "en"): ResumeData => ({
  basics: defaultBasics,
  sections: getSectionsByVariant(variant),
  metadata: defaultMetadata,
});

// Default resume data uses the default variant
export const defaultResumeData = getResumeData("ru");

export * from "./basics";
export * from "./metadata";
export * from "./sample";
export * from "./sections";
export * from "./shared";
