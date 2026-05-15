import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verify admin session
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin profile
  const adminClient = createAdminSupabaseClient();
  const { data: adminProfile, error: adminError } = await adminClient
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (adminError || !adminProfile) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // Get document record
  const { data: doc, error } = await adminClient
    .from("applicant_documents")
    .select("storage_path, file_name, mime_type")
    .eq("id", id)
    .single();

  if (error || !doc) {
    return NextResponse.json(
      { error: "Dokumen tidak ditemukan" },
      { status: 404 }
    );
  }

  // Generate signed URL (60 seconds)
  const { data: signed, error: signError } = await adminClient.storage
    .from("applicant-documents")
    .createSignedUrl(doc.storage_path, 60);

  if (signError || !signed) {
    return NextResponse.json(
      { error: "Gagal membuat link dokumen" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: signed.signedUrl, fileName: doc.file_name });
}
