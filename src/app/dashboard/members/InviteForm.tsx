"use client";

import { useState, useTransition } from "react";
import { inviteUser } from "../actions/members";

export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [pending, start] = useTransition();

  function submit() {
    start(async () => {
      await inviteUser({ email, role });
      setEmail("");
      setRole("USER");
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-2 border p-4 rounded"
    >
      <h3 className="font-semibold">Inviter un membre</h3>
      <input
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
        className="border p-2 rounded"
      >
        <option value="USER">Lecteur (USER)</option>
        <option value="ADMIN">Éditeur (ADMIN)</option>
      </select>

      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer l’invitation"}
      </button>
    </form>
  );
}
