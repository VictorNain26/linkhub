export type BrandKit = {
  primary?: string;
  primaryForeground?: string;
  background?: string;
  radiusLg?: number;
};

export function varsFromTheme(theme: BrandKit | null | undefined) {
  if (!theme) return {};
  const css: Record<string, string> = {};
  if (theme.primary) css['--primary'] = theme.primary;
  if (theme.primaryForeground) css['--primary-foreground'] = theme.primaryForeground;
  if (theme.background) css['--background'] = theme.background;
  if (theme.radiusLg) css['--radius-lg'] = `${theme.radiusLg}px`;
  return css;
}
