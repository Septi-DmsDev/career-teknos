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

  // Get document record
  const adminClient = createAdminSupabaseClient();
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
