"use client";

import { useState, useTransition } from "react";
import { createLink, updateLink } from "@/actions/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Save } from "lucide-react";

type Props = {
  tenantSlug: string;
  defaultValues?: { id: number; slug: string; url: string };
  onDone?: () => void;
};

export default function LinkForm({ tenantSlug, defaultValues, onDone }: Props) {
  const [pending, start] = useTransition();
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [url, setUrl] = useState(defaultValues?.url ?? "");
  const [errors, setErrors] = useState<{ slug?: string; url?: string }>({});

  const action = defaultValues ? updateLink : createLink;
  const isEditing = !!defaultValues;

  function validateForm() {
    const newErrors: { slug?: string; url?: string } = {};
    
    if (!slug.trim()) {
      newErrors.slug = "Le slug est requis";
    } else if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
      newErrors.slug = "Le slug ne peut contenir que des lettres, chiffres, tirets et underscores";
    }
    
    if (!url.trim()) {
      newErrors.url = "L'URL est requise";
    } else if (!/^https?:\/\/.+/.test(url)) {
      newErrors.url = "L'URL doit commencer par http:// ou https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) return;
    
    start(async () => {
      try {
        await action({ id: defaultValues?.id, slug, url }, tenantSlug);
        onDone?.();
        if (!isEditing) {
          setSlug("");
          setUrl("");
        }
        setErrors({});
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    });
  }

  const content = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="ex: github, portfolio, blog"
          aria-invalid={!!errors.slug}
          className={errors.slug ? "border-destructive focus-visible:ring-destructive/20" : ""}
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url">URL de destination *</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          aria-invalid={!!errors.url}
          className={errors.url ? "border-destructive focus-visible:ring-destructive/20" : ""}
        />
        {errors.url && (
          <p className="text-sm text-destructive">{errors.url}</p>
        )}
      </div>
      
      <Button
        type="submit"
        disabled={pending || !slug.trim() || !url.trim()}
        className="w-full"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            En cours...
          </>
        ) : isEditing ? (
          <>
            <Save className="size-4" />
            Mettre à jour
          </>
        ) : (
          <>
            <Plus className="size-4" />
            Créer le lien
          </>
        )}
      </Button>
    </form>
  );

  if (isEditing) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="size-5" />
          Nouveau lien
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
