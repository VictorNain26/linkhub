"use client";

import { useState, useTransition } from "react";
import { createLink, updateLink } from "./actions/links";

type Props = {
  defaultValues?: { id: number; slug: string; url: string };
  onDone?: () => void;
};

export default function LinkForm({ defaultValues, onDone }: Props) {
  const [pending, start] = useTransition();
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [url, setUrl] = useState(defaultValues?.url ?? "");

  const action = defaultValues ? updateLink : createLink;

  function handleSubmit() {
    start(async () => {
      await action({ id: defaultValues?.id, slug, url });
      onDone?.();
      setSlug("");
      setUrl("");
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-2"
    >
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Slug (ex. github)"
        className="border p-2 rounded"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://…"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {pending ? "…En cours" : defaultValues ? "Mettre à jour" : "Créer"}
      </button>
    </form>
  );
}
