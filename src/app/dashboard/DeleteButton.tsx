"use client";

import { useTransition } from "react";
import { deleteLink } from "./actions/links";

export default function DeleteButton({ id }: { id: number }) {
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          if (!confirm("Supprimer ce lien ?")) return;
          const fd = new FormData();
          fd.append("id", String(id));
          await deleteLink(fd);
        })
      }
      className="text-red-600 text-sm ml-2 disabled:opacity-40"
      title="Supprimer"
    >
      {pending ? "…" : "🗑️"}
    </button>
  );
}
