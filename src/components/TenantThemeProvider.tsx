import { varsFromTheme, type BrandKit } from '@/lib/theme';
import type { Prisma } from '@prisma/client';

function toBrandKit(json: Prisma.JsonValue | null | undefined): BrandKit | null {
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    const o = json as Record<string, unknown>;
    return {
      primary:           typeof o.primary           === 'string' ? o.primary           : undefined,
      primaryForeground: typeof o.primaryForeground === 'string' ? o.primaryForeground : undefined,
      background:        typeof o.background        === 'string' ? o.background        : undefined,
      radiusLg:          typeof o.radiusLg          === 'number' ? o.radiusLg          : undefined,
    };
  }
  return null;
}

export default function TenantThemeProvider({
  theme,
  children,
}: {
  theme: Prisma.JsonValue | BrandKit | null | undefined;
  children: React.ReactNode;
}) {
  const brandKit = toBrandKit(theme as Prisma.JsonValue) ?? (theme as BrandKit | null);
  return <div style={varsFromTheme(brandKit)}>{children}</div>;
}
