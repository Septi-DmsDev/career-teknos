import { z } from "zod";

import { employmentTypes, jobStatuses } from "@/lib/domain";
import { slugify } from "@/lib/utils";

const listField = z
  .string()
  .trim()
  .min(2)
  .transform((value) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const jobSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(180)
    .transform(slugify),
  departmentId: z.string().uuid(),
  employmentType: z.enum(employmentTypes),
  location: z.string().trim().min(2).max(120),
  description: z.string().trim().min(20).max(4000),
  responsibilities: listField,
  requirements: listField,
  benefits: listField,
  deadline: z.string().trim().optional().or(z.literal("")),
  status: z.enum(jobStatuses),
});

export type JobInput = z.infer<typeof jobSchema>;
