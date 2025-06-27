import { assertRole } from '@/lib/rbac';
import prisma from '@/lib/prisma';
import ThemeForm from './ThemeForm';
import TenantThemeProvider from '@/components/TenantThemeProvider';

export default async function Appearance({
  params: { tenant },
}: {
  params: { tenant: string };
}) {
  const { tenant: t } = await assertRole('ADMIN', tenant);
  const record = await prisma.tenant.findUnique({
    where: { id: t.id },
    select: { theme: true },
  });

  return (
    <TenantThemeProvider theme={record?.theme}>
      <main className="p-8 max-w-md space-y-8 bg-background text-foreground">
        <h1 className="text-2xl font-bold">Thème & Brand kit</h1>
        <ThemeForm tenantSlug={tenant} current={record?.theme ?? {}} />
      </main>
    </TenantThemeProvider>
  );
}
