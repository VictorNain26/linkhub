import { redirect } from "next/navigation";
import { assertRole } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import InviteForm from "./InviteForm";
import MembersTable from "./MembersTable";

export default async function MembersPage() {
  const ctx = await assertRole("ADMIN");           // ADMIN ou OWNER
  const { tenant } = ctx;

  const members = await prisma.membership.findMany({
    where: { tenantId: tenant.id },
    include: { user: { select: { email: true, name: true, id: true } } },
    orderBy: { role: "desc" },
  });

  return (
    <main className="p-8 space-y-8 max-w-xl">
      <h1 className="text-2xl font-bold">Membres du workspace</h1>
      <InviteForm />                  {/* form client pour inviter */}
      <MembersTable members={members} /> {/* table client pour changer rôle / retirer */}
    </main>
  );
}
