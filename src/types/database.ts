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

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          full_name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          full_name?: string;
          is_active?: boolean;
        };
      };
      departments: {
        Row: {
          id: string;
          code: DepartmentCode;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: DepartmentCode;
          name: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          is_active?: boolean;
        };
      };
      jobs: {
        Row: {
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
        };
        Insert: {
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
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
      };
      applicants: {
        Row: {
          id: string;
          job_id: string;
          full_name: string;
          email: string;
          whatsapp: string;
          current_status: ApplicantStatus;
          payload: Json;
          submitted_at: string;
        };
        Insert: {
          id: string;
          job_id: string;
          full_name: string;
          email: string;
          whatsapp: string;
          current_status?: ApplicantStatus;
          payload: Json;
          submitted_at?: string;
        };
        Update: {
          current_status?: ApplicantStatus;
          payload?: Json;
        };
      };
      applicant_documents: {
        Row: {
          id: string;
          applicant_id: string;
          document_type: string;
          file_name: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          applicant_id: string;
          document_type: string;
          file_name: string;
          storage_path: string;
          mime_type: string;
          size_bytes: number;
          created_at?: string;
        };
        Update: never;
      };
      applicant_notes: {
        Row: {
          id: string;
          applicant_id: string;
          admin_id: string;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          applicant_id: string;
          admin_id: string;
          note: string;
          created_at?: string;
        };
        Update: {
          note?: string;
        };
      };
      status_histories: {
        Row: {
          id: string;
          applicant_id: string;
          from_status: ApplicantStatus | null;
          to_status: ApplicantStatus;
          admin_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          applicant_id: string;
          from_status?: ApplicantStatus | null;
          to_status: ApplicantStatus;
          admin_id: string;
          created_at?: string;
        };
        Update: never;
      };
      activity_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
};
