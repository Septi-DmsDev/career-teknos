import { sampleApplicants } from "@/lib/data/sample";
import type { ApplicantStatus, ApplicantSummary } from "@/lib/domain";

export async function getRecentApplicants(limit = 10): Promise<ApplicantSummary[]> {
  return sampleApplicants.slice(0, limit);
}

export async function getApplicantStats() {
  const statusCounts = sampleApplicants.reduce<Record<ApplicantStatus, number>>(
    (accumulator, applicant) => {
      accumulator[applicant.status] += 1;
      return accumulator;
    },
    {
      new: 0,
      screening: 0,
      shortlisted: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
      talent_pool: 0,
    },
  );

  return {
    total: sampleApplicants.length,
    activeJobs: 3,
    ...statusCounts,
  };
}
