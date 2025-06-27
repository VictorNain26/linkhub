import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";

export default async function DashboardIndex() {
  const ctx = await getTenantContext();
  redirect(`/dashboard/${ctx.current.slug}`);
}
