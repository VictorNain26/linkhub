import { redirect } from "next/navigation";
import { getTenantContext } from "@/lib/tenant";
import CopyPublicLink from "./CopyPublicLink";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant?: string }>;  // 👈 Promise
}) {
  const { tenant: slug } = await params;               // 👈 on await
  const ctx          = await getTenantContext(slug);
  const { current, memberships, role } = ctx;

  if (slug !== current.slug) redirect(`/dashboard/${current.slug}`);

  return (
    <>
      <header className="flex flex-wrap items-center gap-4 p-4 border-b">
        <h1 className="font-bold text-xl">{current.name}</h1>

        <select
          className="border p-1"
          defaultValue={current.slug}
          onChange={(e) => (location.href = `/dashboard/${e.target.value}`)}
        >
          {memberships.map((m) => (
            <option key={m.tenant.id} value={m.tenant.slug}>
              {m.tenant.name} ({m.role})
            </option>
          ))}
        </select>

        <a
          href={`/${current.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 text-sm"
        >
          Page publique
        </a>
        <CopyPublicLink slug={current.slug} />

        <span className="ml-auto text-xs text-gray-500">role : {role}</span>
      </header>

      {children}
    </>
  );
}

export const dynamic = "force-dynamic";
