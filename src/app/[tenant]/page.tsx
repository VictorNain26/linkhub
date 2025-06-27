import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TenantThemeProvider from '@/components/TenantThemeProvider';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant } = await params;
  const t = await prisma.tenant.findUnique({
    where: { slug: tenant },
    select: { name: true },
  });
  return { title: t ? `${t.name} — LinkHub` : 'Page inexistante' };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const data = await prisma.tenant.findUnique({
    where: { slug: tenant },
    select: {
      id: true,
      slug: true,
      name: true,
      theme: true,
      links: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, slug: true },
      },
    },
  });
  if (!data) notFound();

  return (
    <TenantThemeProvider theme={data.theme}>
      <main className="min-h-screen flex flex-col items-center gap-6 p-8 bg-background text-foreground">
        <h1 className="text-3xl font-bold text-center">{data.name}</h1>

        <ul className="w-full max-w-sm space-y-3">
          {data.links.map((l) => (
            <li key={l.id}>
              <Link
                href={`/p/${data.slug}/${l.slug}`}
                target="_blank"
                className="block w-full bg-primary text-primary-foreground rounded-lg py-3 text-center hover:opacity-90 transition"
              >
                {l.slug}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </TenantThemeProvider>
  );
}
