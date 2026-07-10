import { NextResponse } from "next/server";
import { getAllDepartments, getRegionColor } from "@/lib/collection";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId");
    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const query = admin
      .from("collected_departments")
      .select("dept_code, dept_name, region, collected_at")
      .order("collected_at", { ascending: true });

    const { data: collected, error } = user
      ? await query.eq("user_id", user.id)
      : guestId
        ? await query.eq("guest_id", guestId)
        : { data: [], error: null };

    if (error) throw error;

    const ownedMap = new Map(
      (collected ?? []).map((item) => [item.dept_code, item])
    );

    const magnets = getAllDepartments().map((dept) => {
      const owned = ownedMap.get(dept.code);
      return {
        code: dept.code,
        name: dept.name,
        region: dept.region,
        color: getRegionColor(dept.region),
        owned: Boolean(owned),
        collected_at: owned?.collected_at ?? undefined,
      };
    });

    return NextResponse.json({
      magnets,
      count: ownedMap.size,
      total: magnets.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
