"use client";

import { useState, useTransition } from "react";
import { createInvite } from "@/actions/members";

export default function InviteForm() {
  const [role, setRole]   = useState<"ADMIN" | "USER">("USER");
  const [link, setLink]   = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start]  = useTransition();

  function generate() {
    start(async () => {
      try {
        const token = await createInvite(role);
        const full  = `${window.location.origin}/accept-invite?token=${token}`;
        await navigator.clipboard.writeText(full);
        setLink(full);
        setError(null);
      } catch (e) {
        setLink(null);
        setError((e as Error).message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 border p-4 rounded">
      <h3 className="font-semibold">Générer un lien d’invitation</h3>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
        className="border p-2 rounded"
      >
        <option value="USER">Lecteur (USER)</option>
        <option value="ADMIN">Éditeur (ADMIN)</option>
      </select>

      <button
        disabled={pending}
        onClick={generate}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {pending ? "…En cours" : "Copier le lien"}
      </button>

      {link && (
        <p className="text-xs text-green-700 break-all">
          Lien copié !<br /> {link}
        </p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
