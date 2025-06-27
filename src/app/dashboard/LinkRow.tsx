"use client";

import { useState } from "react";
import LinkForm from "./LinkForm";
import DeleteButton from "./DeleteButton";

type Props = {
  tenantSlug: string;
  link: {
    id: number;
    slug: string;
    url: string;
    clicks: number;
  };
};

export default function LinkRow({ link, tenantSlug }: Props) {
  const [editing, setEditing] = useState(false);
  const publicUrl = `/p/${tenantSlug}/${link.slug}`;

  return (
    <li className="flex flex-col gap-2 border p-3 rounded">
      {/* ligne principale */}
      <div className="flex items-center gap-2">
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-blue-600 hover:underline"
        >
          {link.slug}
        </a>

        <span className="ml-auto text-xs text-gray-500">
          {link.clicks} clic{link.clicks > 1 ? "s" : ""}
        </span>

        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="text-sm"
          title="Éditer"
        >
          ✏️
        </button>

        <DeleteButton id={link.id} />
      </div>

      {/* formulaire d'édition */}
      {editing && (
        <div className="bg-white border p-4 rounded shadow">
          <LinkForm
            defaultValues={{ id: link.id, slug: link.slug, url: link.url }}
            onDone={() => setEditing(false)}
          />
        </div>
      )}
    </li>
  );
}
