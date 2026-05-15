import { z } from "zod";

export const requiredDocumentTypes = ["cv", "ktp", "ijazah"] as const;

export const optionalDocumentTypes = [
  "transcript",
  "photo",
  "portfolio",
] as const;

export const documentTypes = [
  ...requiredDocumentTypes,
  ...optionalDocumentTypes,
] as const;

export type DocumentType = (typeof documentTypes)[number];

export const documentRules: Record<
  DocumentType,
  { label: string; maxMb: number; mimeTypes: string[]; required: boolean }
> = {
  cv: {
    label: "CV",
    maxMb: 5,
    required: true,
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  ktp: {
    label: "KTP",
    maxMb: 5,
    required: true,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  ijazah: {
    label: "Ijazah",
    maxMb: 5,
    required: true,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  transcript: {
    label: "Transkrip",
    maxMb: 5,
    required: false,
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  },
  photo: {
    label: "Pas Foto",
    maxMb: 2,
    required: false,
    mimeTypes: ["image/jpeg", "image/png"],
  },
  portfolio: {
    label: "Portofolio",
    maxMb: 10,
    required: false,
    mimeTypes: ["application/pdf"],
  },
};

export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().trim().min(3).max(120),
  birthPlace: z.string().trim().min(2).max(80),
  birthDate: z.string().trim().min(1),
  gender: z.enum(["male", "female"]),
  email: z.string().trim().email().max(160).toLowerCase(),
  whatsapp: z.string().trim().min(8).max(30),
  alternatePhone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().min(10).max(600),
  educationLevel: z.string().trim().min(2).max(80),
  institution: z.string().trim().min(2).max(140),
  major: z.string().trim().min(2).max(120),
  graduationYear: z.coerce.number().int().min(1970).max(2100),
  workExperience: z.string().trim().min(2).max(1200),
  mainSkills: z.string().trim().min(2).max(800),
  expectedSalary: z.coerce.number().int().positive().optional(),
  availableDate: z.string().trim().min(1),
  source: z.string().trim().min(2).max(120),
  consent: z.literal(true, {
    error: "Persetujuan pengolahan data wajib dicentang.",
  }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
