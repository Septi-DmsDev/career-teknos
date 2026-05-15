import type {
  ApplicantStatus,
  DepartmentCode,
  EmploymentType,
  JobStatus,
} from "@/lib/domain";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_profiles: Table<
        {
          id: string;
          full_name: string;
          is_active: boolean;
          created_at: string;
        },
        {
          id: string;
          full_name: string;
          is_active?: boolean;
          created_at?: string;
        },
        {
          full_name?: string;
          is_active?: boolean;
        }
      >;
      departments: Table<
        {
          id: string;
          code: DepartmentCode;
          name: string;
          slug: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        },
        {
          id?: string;
          code: DepartmentCode;
          name: string;
          slug: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        },
        {
          name?: string;
          slug?: string;
          sort_order?: number;
          is_active?: boolean;
        }
      >;
      jobs: Table<
        {
          id: string;
          title: string;
          slug: string;
          department_id: string;
          employment_type: EmploymentType;
          location: string;
          description: string;
          responsibilities: string[];
          requirements: string[];
          benefits: string[];
          status: JobStatus;
          deadline: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          closed_at: string | null;
          created_by: string | null;
          updated_by: string | null;
        },
        {
          id?: string;
          title: string;
          slug: string;
          department_id: string;
          employment_type: EmploymentType;
          location: string;
          description: string;
          responsibilities?: string[];
          requirements?: string[];
          benefits?: string[];
          status?: JobStatus;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          closed_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
        }
      >;
      applicants: Table<
        {
          id: string;
          job_id: string;
          full_name: string;
          birth_place: string | null;
          birth_date: string | null;
          gender: string | null;
          email: string;
          whatsapp_number: string;
          alternative_phone: string | null;
          domicile_address: string;
          last_education: string;
          institution_name: string | null;
          major: string | null;
          graduation_year: number | null;
          work_experience: string | null;
          skills: string | null;
          expected_salary: number | null;
          available_start_date: string | null;
          source_info: string | null;
          consent_data_usage: boolean;
          current_status: ApplicantStatus;
          submitted_at: string;
        },
        {
          id: string;
          job_id: string;
          full_name: string;
          birth_place?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          email: string;
          whatsapp_number: string;
          alternative_phone?: string | null;
          domicile_address: string;
          last_education: string;
          institution_name?: string | null;
          major?: string | null;
          graduation_year?: number | null;
          work_experience?: string | null;
          skills?: string | null;
          expected_salary?: number | null;
          available_start_date?: string | null;
          source_info?: string | null;
          consent_data_usage?: boolean;
          current_status?: ApplicantStatus;
          submitted_at?: string;
        },
        {
          current_status?: ApplicantStatus;
          birth_place?: string | null;
          birth_date?: string | null;
          gender?: string | null;
          alternative_phone?: string | null;
          work_experience?: string | null;
          skills?: string | null;
          expected_salary?: number | null;
          available_start_date?: string | null;
          source_info?: string | null;
        }
      >;
      applicant_documents: Table<
        {
          id: string;
          applicant_id: string;
          document_type: string;
          file_name: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          created_at: string;
        },
        {
          id?: string;
          applicant_id: string;
          document_type: string;
          file_name: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          created_at?: string;
        },
        never
      >;
      applicant_notes: Table<
        {
          id: string;
          applicant_id: string;
          admin_id: string;
          note: string;
          created_at: string;
        },
        {
          id?: string;
          applicant_id: string;
          admin_id: string;
          note: string;
          created_at?: string;
        },
        {
          note?: string;
        }
      >;
      status_histories: Table<
        {
          id: string;
          applicant_id: string;
          from_status: ApplicantStatus | null;
          to_status: ApplicantStatus;
          admin_id: string | null;
          note: string | null;
          created_at: string;
        },
        {
          id?: string;
          applicant_id: string;
          from_status?: ApplicantStatus | null;
          to_status: ApplicantStatus;
          admin_id?: string | null;
          note?: string | null;
          created_at?: string;
        },
        never
      >;
      activity_logs: Table<
        {
          id: string;
          admin_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        },
        {
          id?: string;
          admin_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        },
        never
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_active_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      job_status: JobStatus;
      applicant_status: ApplicantStatus;
      employment_type: EmploymentType;
    };
    CompositeTypes: Record<string, never>;
  };
};
