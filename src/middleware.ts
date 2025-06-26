import { NextResponse } from "next/server";
import { auth } from "@/auth";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { idle_timeout: 2 });

export async function middleware() {
  const session = await auth();
  const id = session?.user?.tenantId ?? "public";
  await sql`SELECT set_config('app.tenant_id', ${id}, true)`;
  return NextResponse.next();
}

export const config = { matcher: ["/((?!api/auth|_next|favicon).*)"] };
