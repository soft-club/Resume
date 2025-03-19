// import { t } from "@lingui/macro";
import { z } from "zod";

import type { FilterKeys } from "../shared";
import { idSchema } from "../shared";
import { awardSchema } from "./award";
import { certificationSchema } from "./certification";
import { customSectionSchema } from "./custom-section";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";
import { interestSchema } from "./interest";
import { languageSchema } from "./language";
import { profileSchema } from "./profile";
import { projectSchema } from "./project";
import { publicationSchema } from "./publication";
import { referenceSchema } from "./reference";
import { skillSchema } from "./skill";
import { volunteerSchema } from "./volunteer";

// Schema
export const sectionSchema = z.object({
  name: z.string(),
  columns: z.number().min(1).max(5).default(1),
  separateLinks: z.boolean().default(true),
  visible: z.boolean().default(true),
});

// Schema
export const customSchema = sectionSchema.extend({
  id: idSchema,
  items: z.array(customSectionSchema),
});

export const sectionsSchema = z.object({
  summary: sectionSchema.extend({
    id: z.literal("summary"),
    content: z.string().default(""),
  }),
  awards: sectionSchema.extend({
    id: z.literal("awards"),
    items: z.array(awardSchema),
  }),
  certifications: sectionSchema.extend({
    id: z.literal("certifications"),
    items: z.array(certificationSchema),
  }),
  education: sectionSchema.extend({
    id: z.literal("education"),
    items: z.array(educationSchema),
  }),
  experience: sectionSchema.extend({
    id: z.literal("experience"),
    items: z.array(experienceSchema),
  }),
  volunteer: sectionSchema.extend({
    id: z.literal("volunteer"),
    items: z.array(volunteerSchema),
  }),
  interests: sectionSchema.extend({
    id: z.literal("interests"),
    items: z.array(interestSchema),
  }),
  languages: sectionSchema.extend({
    id: z.literal("languages"),
    items: z.array(languageSchema),
  }),
  profiles: sectionSchema.extend({
    id: z.literal("profiles"),
    items: z.array(profileSchema),
  }),
  projects: sectionSchema.extend({
    id: z.literal("projects"),
    items: z.array(projectSchema),
  }),
  publications: sectionSchema.extend({
    id: z.literal("publications"),
    items: z.array(publicationSchema),
  }),
  references: sectionSchema.extend({
    id: z.literal("references"),
    items: z.array(referenceSchema),
  }),
  skills: sectionSchema.extend({
    id: z.literal("skills"),
    items: z.array(skillSchema),
  }),
  custom: z.record(z.string(), customSchema),
});

// Detailed Types
export type Section = z.infer<typeof sectionSchema>;
export type Sections = z.infer<typeof sectionsSchema>;

export type SectionKey = "basics" | keyof Sections | `custom.${string}`;
export type SectionWithItem<T = unknown> = Sections[FilterKeys<Sections, { items: T[] }>];
export type SectionItem = SectionWithItem["items"][number];
export type CustomSectionGroup = z.infer<typeof customSchema>;

// Defaults
export const defaultSection: Section = {
  name: "",
  columns: 1,
  separateLinks: true,
  visible: true,
};

export const defaultSections: Sections = {
  summary: { ...defaultSection, id: "summary", name: "Summary", content: "" },
  awards: { ...defaultSection, id: "awards", name: "Awards", items: [] },
  certifications: { ...defaultSection, id: "certifications", name: "Certifications", items: [] },
  education: { ...defaultSection, id: "education", name: "Education", items: [] },
  experience: { ...defaultSection, id: "experience", name: "Experience", items: [] },
  volunteer: { ...defaultSection, id: "volunteer", name: "Volunteering", items: [] },
  interests: { ...defaultSection, id: "interests", name: "Interests", items: [] },
  languages: { ...defaultSection, id: "languages", name: "Languages", items: [] },
  profiles: { ...defaultSection, id: "profiles", name: "Profiles", items: [] },
  projects: { ...defaultSection, id: "projects", name: "Projects", items: [] },
  publications: { ...defaultSection, id: "publications", name: "Publications", items: [] },
  references: { ...defaultSection, id: "references", name: "References", items: [] },
  skills: { ...defaultSection, id: "skills", name: "Skills", items: [] },
  custom: {},
};


export const defaultSectionsRussian: Sections = {
  summary: { ...defaultSection, id: "summary", name: "Обо мне", content: "" },
  awards: { ...defaultSection, id: "awards", name: "Награды", items: [] },
  certifications: { ...defaultSection, id: "certifications", name: "Сертификаты", items: [] },
  education: { ...defaultSection, id: "education", name: "Образование", items: [] },
  experience: { ...defaultSection, id: "experience", name: "Опыт", items: [] },
  volunteer: { ...defaultSection, id: "volunteer", name: "Волонтерство", items: [] },
  interests: { ...defaultSection, id: "interests", name: "Интересы", items: [] },
  languages: { ...defaultSection, id: "languages", name: "Языки", items: [] },
  profiles: { ...defaultSection, id: "profiles", name: "Профили", items: [] },
  projects: { ...defaultSection, id: "projects", name: "Проекты", items: [] },
  publications: { ...defaultSection, id: "publications", name: "Публикации", items: [] },
  references: { ...defaultSection, id: "references", name: "Отзывы", items: [] },
  skills: { ...defaultSection, id: "skills", name: "Навыки", items: [] },
  custom: {},
};

export const defaultSectionsUzbek: Sections = {
  summary: { ...defaultSection, id: "summary", name: "Mening haqimda", content: "" },
  awards: { ...defaultSection, id: "awards", name: "Mukofotlar", items: [] },
  certifications: { ...defaultSection, id: "certifications", name: "Sertifikatlar", items: [] },
  education: { ...defaultSection, id: "education", name: "Ta'lim", items: [] },
  experience: { ...defaultSection, id: "experience", name: "Ish tajribasi", items: [] },
  volunteer: { ...defaultSection, id: "volunteer", name: "Ko'ngillilik", items: [] },
  interests: { ...defaultSection, id: "interests", name: "Qiziqishlar", items: [] },
  languages: { ...defaultSection, id: "languages", name: "Tillar", items: [] },
  profiles: { ...defaultSection, id: "profiles", name: "Profillar", items: [] },
  projects: { ...defaultSection, id: "projects", name: "Loyihalar", items: [] },
  publications: { ...defaultSection, id: "publications", name: "Nashrlar", items: [] },
  references: { ...defaultSection, id: "references", name: "Tavsiyalar", items: [] },
  skills: { ...defaultSection, id: "skills", name: "Ko'nikmalar", items: [] },
  custom: {},
};

export type ResumeVariant = "en" | "ru" | "uz";

export const getSectionsByVariant = (variant: ResumeVariant): Sections => {
  switch (variant) {
    case "ru": {
      return defaultSectionsRussian;
    }
    case "uz": {
      return defaultSectionsUzbek;
    }
    default: {
      return defaultSections;
    }
  }
};

export * from "./award";
export * from "./certification";
export * from "./custom-section";
export * from "./education";
export * from "./experience";
export * from "./interest";
export * from "./language";
export * from "./profile";
export * from "./project";
export * from "./publication";
export * from "./reference";
export * from "./skill";
export * from "./volunteer";
