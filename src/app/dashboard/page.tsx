import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";

export default async function DashboardIndex() {
  const ctx = await getTenantContext(undefined);
  redirect(`/dashboard/${ctx.current.slug}`);
}
