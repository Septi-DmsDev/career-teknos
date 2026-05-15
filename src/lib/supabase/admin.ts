import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getAdminSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export function createAdminSupabaseClient() {
  const { url, serviceRoleKey } = getAdminSupabaseEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
