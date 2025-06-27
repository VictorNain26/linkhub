"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Item = { slug: string; name: string; role: string };

export default function WorkspaceSelect({
  current,
  items,
}: {
  current: string;
  items: Item[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(current);

  /* remet la valeur quand le layout est re-monté avec un nouveau slug */
  useEffect(() => setValue(current), [current]);

  return (
    <select
      className="border p-1"
      value={value}
      onChange={(e) => {
        const slug = e.target.value;
        setValue(slug);
        router.push(`/dashboard/${slug}`);
      }}
    >
      {items.map((i) => (
        <option key={i.slug} value={i.slug}>
          {i.name} ({i.role})
        </option>
      ))}
    </select>
  );
}
