import { describe, expect, it } from "vitest";

import { sanitizeFileName, slugify } from "./utils";

describe("slugify", () => {
  it("creates a lowercase URL slug from a job title", () => {
    expect(slugify("Staff Gudang / Packing Teknos")).toBe(
      "staff-gudang-packing-teknos",
    );
  });
});

describe("sanitizeFileName", () => {
  it("keeps safe filename characters and removes path separators", () => {
    expect(sanitizeFileName("../CV Pelamar Final!.pdf")).toBe(
      "CV-Pelamar-Final.pdf",
    );
  });
});
