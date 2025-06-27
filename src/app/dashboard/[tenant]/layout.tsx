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

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;
  const ctx = await getTenantContext(slug);
  const { current, memberships, role } = ctx;
  const theme = (await prisma.tenant.findUnique({ where: { id: current.id }, select: { theme: true } }))?.theme;

  return (
    <TenantThemeProvider theme={theme}>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <header className="flex flex-wrap items-center gap-4 p-4 border-b border-border">
          <h1 className="font-bold text-xl">{current.name}</h1>
          <WorkspaceSelect current={current.slug} items={memberships.map(m => ({ slug: m.tenant.slug, name: m.tenant.name, role: m.role }))} />
          <Link href={`/dashboard/${current.slug}`} className="text-sm underline text-primary">Dashboard</Link>
          <Link href={`/${current.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm underline text-primary">Page publique</Link>
          <CopyPublicLink slug={current.slug} />
          {role !== 'USER' && <Link href={`/dashboard/${current.slug}/members`} className="text-sm underline text-primary">Membres</Link>}
          <LogoutButton />
          <span className="ml-auto text-xs text-muted">role : {role}</span>
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </TenantThemeProvider>
  );
}
