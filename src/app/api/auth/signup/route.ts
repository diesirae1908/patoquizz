import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { email, password, username, country, guestId } = await request.json();
    const supabase = await createClient();
    const admin = createAdminClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, country },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      await admin.from("profiles").upsert({
        id: data.user.id,
        username,
        country: country ?? null,
        guest_id: guestId ?? null,
      });

      if (guestId) {
        await admin
          .from("results")
          .update({ user_id: data.user.id, guest_id: null })
          .eq("guest_id", guestId)
          .is("user_id", null);

        await admin
          .from("collected_departments")
          .update({ user_id: data.user.id, guest_id: null })
          .eq("guest_id", guestId)
          .is("user_id", null);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
