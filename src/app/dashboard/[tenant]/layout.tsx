import { getTenantContext } from '@/lib/tenant';
import prisma from '@/lib/prisma';
import WorkspaceSelect from './WorkspaceSelect';
import CopyPublicLink from '../CopyPublicLink';
import LogoutButton from '../LogoutButton';
import TenantThemeProvider from '@/components/TenantThemeProvider';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const ctx = await getTenantContext(slug);
  const { current, memberships, role } = ctx;

  const theme = (
    await prisma.tenant.findUnique({
      where: { id: current.id },
      select: { theme: true },
    })
  )?.theme;

  return (
    <TenantThemeProvider theme={theme}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className="font-bold text-xl text-foreground">{current.name}</h1>
                
                <WorkspaceSelect
                  current={current.slug}
                  items={memberships.map((m) => ({
                    slug: m.tenant.slug,
                    name: m.tenant.name,
                    role: m.role,
                  }))}
                />
              </div>

              <nav className="hidden md:flex items-center gap-2">
                <Link
                  href={`/dashboard/${current.slug}`}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/${current.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Page publique
                </Link>

                {role !== 'USER' && (
                  <>
                    <Link
                      href={`/dashboard/${current.slug}/members`}
                      className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      Membres
                    </Link>
                    <Link
                      href={`/dashboard/${current.slug}/appearance`}
                      className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      Apparence
                    </Link>
                  </>
                )}

                <CopyPublicLink slug={current.slug} />
                <LogoutButton />
              </nav>

              <div className="flex md:hidden items-center gap-2">
                <CopyPublicLink slug={current.slug} />
                <LogoutButton />
              </div>
            </div>

            {/* Navigation mobile */}
            <div className="md:hidden mt-4 pt-4 border-t border-border">
              <nav className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/${current.slug}`}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/${current.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Page publique
                </Link>

                {role !== 'USER' && (
                  <>
                    <Link
                      href={`/dashboard/${current.slug}/members`}
                      className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      Membres
                    </Link>
                    <Link
                      href={`/dashboard/${current.slug}/appearance`}
                      className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      Apparence
                    </Link>
                  </>
                )}
              </nav>
              <div className="mt-2 text-xs text-muted-foreground">
                Rôle : {role}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
    </TenantThemeProvider>
  );
}
