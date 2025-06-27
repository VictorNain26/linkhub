'use client';

import { useState, useTransition } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveTheme } from '@/actions/theme';
import TenantThemeProvider from '@/components/TenantThemeProvider';

type Props = { tenantSlug: string; current: Record<string, any> };

export default function ThemeForm({ tenantSlug, current }: Props) {
  const [theme, setTheme]       = useState(current);
  const [pending, start]        = useTransition();
  const update = (k: string, v: unknown) => setTheme({ ...theme, [k]: v });

  return (
    <TenantThemeProvider theme={theme}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start(() => saveTheme(tenantSlug, theme));
        }}
        className="grid gap-6 border p-4 rounded-lg bg-muted/50"
      >
        {/* Couleur primaire */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Couleur primaire</label>
          <HexColorPicker color={theme.primary ?? '#2563eb'} onChange={(c) => update('primary', c)} />
        </div>

        {/* Background */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Arrière-plan</label>
          <HexColorPicker color={theme.background ?? '#ffffff'} onChange={(c) => update('background', c)} />
        </div>

        {/* Texte sur bouton */}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Texte sur bouton</label>
          <HexColorPicker color={theme.primaryForeground ?? '#ffffff'} onChange={(c) => update('primaryForeground', c)} />
        </div>

        {/* Rayon global */}
        <div className="grid gap-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Rayon (px)
            <Input
              type="number"
              min={0}
              value={theme.radiusLg ?? 8}
              onChange={(e) => update('radiusLg', +e.target.value)}
              className="w-20"
            />
          </label>
        </div>

        <Button disabled={pending}>{pending ? 'Enregistrement…' : 'Enregistrer'}</Button>
      </form>
    </TenantThemeProvider>
  );
}
