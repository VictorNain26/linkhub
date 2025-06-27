"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLink } from "@/actions/links";

export default function DeleteButton({
  id,
  tenantSlug,
}: {
  id: number;
  tenantSlug: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          if (!confirm("Supprimer ce lien ?")) return;
          const fd = new FormData();
          fd.append("id", String(id));
          await deleteLink(fd, tenantSlug);
          router.refresh();
        })
      }
      className="text-red-600 text-sm ml-2 disabled:opacity-40"
      title="Supprimer"
    >
      {pending ? "…" : "🗑️"}
    </button>
  );
}
