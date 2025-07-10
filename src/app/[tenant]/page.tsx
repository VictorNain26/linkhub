import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TenantThemeProvider from '@/components/TenantThemeProvider';
import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';

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
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {data.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Découvrez tous mes liens importants en un seul endroit
              </p>
            </div>

            {data.links.length > 0 ? (
              <div className="space-y-4 max-w-md mx-auto">
                {data.links.map((l) => (
                  <Link
                    key={l.id}
                    href={`/p/${data.slug}/${l.slug}`}
                    target="_blank"
                    className="group block w-full bg-card hover:bg-card/80 border border-border rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                      {l.slug}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="size-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground">
                  Aucun lien disponible pour le moment
                </p>
              </div>
            )}

            <div className="pt-8">
              <p className="text-sm text-muted-foreground">
                Créé avec ❤️ sur LinkHub
              </p>
            </div>
          </div>
        </div>
      </main>
    </TenantThemeProvider>
  );
}
