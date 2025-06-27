"use client";

import { useState, useTransition } from "react";
import { inviteUser } from "../../../actions/members";

export default function InviteForm() {
  const [email, setEmail]   = useState("");
  const [role, setRole]     = useState<"ADMIN" | "USER">("USER");
  const [link, setLink]     = useState<string | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [pending, start]    = useTransition();

  function submit() {
    start(async () => {
      try {
        const token = await inviteUser({ email, role });
        const full  = `${window.location.origin}/accept-invite?token=${token}`;
        await navigator.clipboard.writeText(full);
        setLink(full);
        setError(null);
        setEmail("");
        setRole("USER");
      } catch (e) {
        setLink(null);
        setError((e as Error).message);
      }
    });
  }

  return (
    <form onSubmit={(e)=>{e.preventDefault(); submit();}}
          className="flex flex-col gap-3 border p-4 rounded">
      <h3 className="font-semibold">Inviter un membre</h3>

      <input required type="email"
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             placeholder="email@example.com"
             className="border p-2 rounded"/>

      <select value={role}
              onChange={(e)=>setRole(e.target.value as "ADMIN"|"USER")}
              className="border p-2 rounded">
        <option value="USER">Lecteur (USER)</option>
        <option value="ADMIN">Éditeur (ADMIN)</option>
      </select>

      <button type="submit" disabled={pending}
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
        {pending ? "Génération…" : "Générer le lien"}
      </button>

      {link && <p className="text-xs text-green-700 break-all">Lien copié !<br/>{link}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
