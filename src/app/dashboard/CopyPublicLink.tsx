"use client";

import { useState } from "react";

export default function CopyPublicLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const fullUrl = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(fullUrl);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
    >
      {copied ? "Copié !" : "Copier l’URL publique"}
    </button>
  );
}
