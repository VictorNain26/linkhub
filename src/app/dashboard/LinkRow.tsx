'use client';

import { useState } from 'react';
import Link from 'next/link';
import LinkForm from './LinkForm';
import DeleteButton from './DeleteButton';
import { useLiveHits } from './LiveHitsContext';

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
  const hits = useLiveHits();
  const currentClicks = hits[link.id] ?? link.clicks;
  const publicUrl = `/p/${tenantSlug}/${link.slug}`;

  return (
    <li className="flex flex-col gap-2 border p-3 rounded">
      <div className="flex items-center gap-2">
        <Link
          href={publicUrl}
          prefetch={false}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-blue-600 hover:underline"
        >
          {link.slug}
        </Link>

        <span className="ml-auto text-xs text-gray-500">
          {currentClicks} clic{currentClicks > 1 ? 's' : ''}
        </span>

        {canEdit && (
          <>
            <button
              type="button"
              onClick={() => setEditing(v => !v)}
              className="text-sm"
              title="Éditer"
            >
              ✏️
            </button>
            <DeleteButton id={link.id} tenantSlug={tenantSlug} />
          </>
        )}
      </div>

      {editing && canEdit && (
        <div className="bg-white border p-4 rounded shadow">
          <LinkForm
            tenantSlug={tenantSlug}
            defaultValues={{ id: link.id, slug: link.slug, url: link.url }}
            onDone={() => setEditing(false)}
          />
        </div>
      )}
    </li>
  );
}
