import { describe, expect, it } from "vitest";

import { applicationSchema, requiredDocumentTypes } from "./application";

const validApplication = {
  jobId: "7bb7deaf-32ac-4f46-9ec9-8c0ee2fb2c7d",
  fullName: "Budi Santoso",
  birthPlace: "Jakarta",
  birthDate: "1998-05-10",
  gender: "male",
  email: "budi@example.com",
  whatsapp: "081234567890",
  alternatePhone: "",
  address: "Jl. Teknos No. 1",
  educationLevel: "S1",
  institution: "Universitas Contoh",
  major: "Teknik Industri",
  graduationYear: 2021,
  workExperience: "2 tahun sebagai staff gudang",
  mainSkills: "Inventory, packing, Microsoft Excel",
  expectedSalary: 4500000,
  availableDate: "2026-06-01",
  source: "Instagram",
  consent: true,
};

describe("applicationSchema", () => {
  it("requires applicant consent", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      consent: false,
    });

    expect(result.success).toBe(false);
  });
});

describe("requiredDocumentTypes", () => {
  it("locks CV, KTP, and Ijazah as required documents", () => {
    expect(requiredDocumentTypes).toEqual(["cv", "ktp", "ijazah"]);
  });
});
