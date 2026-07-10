import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { guestId } = await request.json();
    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !guestId) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 }
      );
    }

    await admin
      .from("results")
      .update({ user_id: user.id, guest_id: null })
      .eq("guest_id", guestId)
      .is("user_id", null);

    await admin
      .from("profiles")
      .update({ guest_id: guestId })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
