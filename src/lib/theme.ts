export type BrandKit = {
  primary?: string;
  background?: string;
  primaryForeground?: string;
  radiusLg?: number;
};

export function varsFromTheme(theme: BrandKit | null | undefined) {
  if (!theme) return {} as React.CSSProperties;
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(theme)) {
    if (v == null) continue;
    const cssKey =
      k === "primaryForeground"
        ? "--primary-foreground"
        : k === "radiusLg"
        ? "--radius-lg"
        : `--${k}`;
    out[cssKey] = String(v);
  }
  return out as React.CSSProperties;
}
