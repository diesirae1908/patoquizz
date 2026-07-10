import { createAdminClient } from "../src/lib/supabase/admin";
import { readFileSync } from "fs";
import { join } from "path";

async function migrate() {
  const supabase = createAdminClient();
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/001_initial_schema.sql"),
    "utf8"
  );

  const { error } = await supabase.rpc("exec_sql", { query: sql });
  if (error) {
    console.log("RPC exec_sql not available, trying direct SQL via REST...");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sql }),
      }
    );

    if (!response.ok) {
      console.error(
        "Migration via RPC failed. Please run supabase/migrations/001_initial_schema.sql in the Supabase SQL editor."
      );
      console.error(await response.text());
      process.exit(1);
    }
  }

  console.log("Migration completed.");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
