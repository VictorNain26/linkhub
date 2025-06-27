import { assertRole } from '@/lib/rbac';
import prisma from '@/lib/prisma';
import ThemeForm from './ThemeForm';
import TenantThemeProvider from '@/components/TenantThemeProvider';
import type { BrandKit } from '@/lib/theme';

export default async function Appearance({
  params: { tenant },
}: {
  params: { tenant: string };
}) {
  const { tenant: t } = await assertRole('ADMIN', tenant);

  const record = await prisma.tenant.findUnique({
    where:  { id: t.id },
    select: { theme: true },
  });

  const currentTheme = (record?.theme ?? {}) as Partial<BrandKit>;

  return (
    <TenantThemeProvider theme={currentTheme}>
      <main className="p-8 max-w-md space-y-8 bg-background text-foreground">
        <h1 className="text-2xl font-bold">Thème & Brand kit</h1>
        <ThemeForm tenantSlug={tenant} current={currentTheme} />
      </main>
    </TenantThemeProvider>
  );
}
