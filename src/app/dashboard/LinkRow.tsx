'use client';

import { useState } from 'react';
import Link from 'next/link';
import LinkForm from './LinkForm';
import DeleteButton from './DeleteButton';
import { useLiveHits } from './LiveHitsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, ExternalLink, Copy } from 'lucide-react';

type Props = {
  tenantSlug: string;
  canEdit: boolean;
  link: {
    id: number;
    slug: string;
    url: string;
    clicks: number;
  };
};

export default function LinkRow({ link, tenantSlug, canEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const hits = useLiveHits();
  const clicks = hits[link.id] ?? link.clicks;
  const publicUrl = `${window.location.origin}/p/${tenantSlug}/${link.slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <TooltipProvider>
      <Card className={editing ? "ring-2 ring-primary/20" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/p/${tenantSlug}/${link.slug}`}
                  prefetch={false}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {link.slug}
                </Link>
                <Badge variant="secondary" className="text-xs">
                  {clicks} clic{clicks > 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate" title={link.url}>
                {link.url}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="h-8 w-8"
                  >
                    <Copy className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copié !" : "Copier le lien"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8"
                  >
                    <Link
                      href={`/p/${tenantSlug}/${link.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ouvrir le lien</TooltipContent>
              </Tooltip>

              {canEdit && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(v => !v)}
                        className="h-8 w-8"
                      >
                        <Edit className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Éditer</TooltipContent>
                  </Tooltip>
                  <DeleteButton id={link.id} tenantSlug={tenantSlug} />
                </>
              )}
            </div>
          </div>

          {editing && canEdit && (
            <div className="mt-4 pt-4 border-t">
              <LinkForm
                tenantSlug={tenantSlug}
                defaultValues={{ id: link.id, slug: link.slug, url: link.url }}
                onDone={() => setEditing(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
