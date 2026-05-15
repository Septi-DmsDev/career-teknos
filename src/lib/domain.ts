export const departments = [
  { code: "warehouse", name: "Gudang" },
  { code: "finishing", name: "Finishing" },
  { code: "design", name: "Desain" },
  { code: "printing", name: "Printing" },
  { code: "customer-service", name: "Customer Service" },
  { code: "logistics-driver", name: "Logistik / Driver" },
  { code: "offset", name: "Offset" },
] as const;

export const jobStatuses = ["draft", "active", "closed", "archived"] as const;

export const applicantStatuses = [
  "new",
  "screening",
  "shortlisted",
  "interview",
  "accepted",
  "rejected",
  "talent_pool",
] as const;

export const employmentTypes = [
  "full_time",
  "contract",
  "internship",
  "part_time",
] as const;

export type DepartmentCode = (typeof departments)[number]["code"];
export type JobStatus = (typeof jobStatuses)[number];
export type ApplicantStatus = (typeof applicantStatuses)[number];
export type EmploymentType = (typeof employmentTypes)[number];

export type JobSummary = {
  id: string;
  slug: string;
  title: string;
  departmentCode: DepartmentCode;
  departmentName: string;
  employmentType: EmploymentType;
  location: string;
  deadline: string | null;
  status: JobStatus;
  applicantCount?: number;
};

export type JobDetail = JobSummary & {
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

export type ApplicantSummary = {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  jobTitle: string;
  departmentName: string;
  status: ApplicantStatus;
  submittedAt: string;
};

export const APPLICANT_STATUS_LABELS: Record<ApplicantStatus, string> = {
  new: "Baru",
  screening: "Screening",
  shortlisted: "Shortlisted",
  interview: "Interview",
  accepted: "Diterima",
  rejected: "Ditolak",
  talent_pool: "Talent Pool",
};

export const APPLICANT_STATUS_COLORS: Record<ApplicantStatus, string> = {
  new: "bg-slate-100 text-slate-700",
  screening: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  talent_pool: "bg-orange-100 text-orange-700",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  cv: "CV / Resume",
  ktp: "KTP",
  ijazah: "Ijazah",
  transkrip: "Transkrip Nilai",
  sertifikat: "Sertifikat",
  foto: "Foto",
  other: "Dokumen Lain",
};

export function formatEmploymentType(type: EmploymentType) {
  const labels: Record<EmploymentType, string> = {
    full_time: "Full-time",
    contract: "Kontrak",
    internship: "Magang",
    part_time: "Part-time",
  };

  return labels[type];
}

export function getDepartmentName(code: DepartmentCode) {
  return departments.find((department) => department.code === code)?.name ?? code;
}
