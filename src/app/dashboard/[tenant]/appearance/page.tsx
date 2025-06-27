import { assertRole } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import ThemeForm from "./ThemeForm";

export default async function Appearance({ params: { tenant } }: { params: { tenant: string } }) {
  const { tenant: t } = await assertRole("ADMIN", tenant);
  return (
    <main className="p-8 max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Thème & Brand kit</h1>
      <ThemeForm tenantId={t.id} current={t.theme as any ?? {}} />
    </main>
  );
}
