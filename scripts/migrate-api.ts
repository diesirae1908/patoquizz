import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { join } from "path";

const PROJECT_REF = "bfcivmhljbowjggxedqj";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

async function runQuery(query: string) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Query failed: ${text}`);
  }

  return response.json();
}

async function migrate() {
  if (!ACCESS_TOKEN) {
    throw new Error("SUPABASE_ACCESS_TOKEN is required");
  }

  const migrationFile =
    process.argv[2] ?? "supabase/migrations/001_initial_schema.sql";

  const sql = readFileSync(join(process.cwd(), migrationFile), "utf8");

  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0 && !statement.startsWith("--"));

  for (const statement of statements) {
    console.log(`Running: ${statement.slice(0, 80)}...`);
    await runQuery(statement);
  }

  console.log("Migration completed.");
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
