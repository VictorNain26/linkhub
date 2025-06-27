import { varsFromTheme } from '@/lib/theme';
export default function TenantThemeProvider({ theme, children }: { theme: unknown; children: React.ReactNode }) {
  return <div style={varsFromTheme(theme as any)}>{children}</div>;
}
