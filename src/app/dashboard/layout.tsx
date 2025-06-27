import { getTenantContext } from "@/lib/tenant";
import WorkspaceSelect from "./WorkspaceSelect";
import CopyPublicLink from "./CopyPublicLink";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant?: string }>;
}) {
  const { tenant: slug } = await params;
  const ctx = await getTenantContext(slug);
  const { current, memberships, role } = ctx;

  return (
    <>
      <header className="flex flex-wrap items-center gap-4 p-4 border-b">
        <h1 className="font-bold text-xl">{current.name}</h1>

        <WorkspaceSelect
          current={current.slug}
          items={memberships.map((m) => ({
            slug: m.tenant.slug,
            name: m.tenant.name,
            role: m.role,
          }))}
        />

        {/* lien Dashboard (toujours visible) */}
        <a
          href={`/dashboard/${current.slug}`}
          className="text-sm underline text-blue-600"
        >
          Dashboard
        </a>

        <a
          href={`/${current.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 text-sm"
        >
          Page publique
        </a>
        <CopyPublicLink slug={current.slug} />

        {["OWNER", "ADMIN"].includes(role) && (
          <a href="/dashboard/members" className="text-sm underline text-blue-600">
            Membres
          </a>
        )}

        <LogoutButton />

        <span className="ml-auto text-xs text-gray-500">role : {role}</span>
      </header>

      {children}
    </>
  );
}

export const dynamic = "force-dynamic";
