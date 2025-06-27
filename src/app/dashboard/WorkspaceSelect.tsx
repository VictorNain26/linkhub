"use client";

type Item = { slug: string; name: string; role: string };

export default function WorkspaceSelect({
  current,
  items,
}: {
  current: string;
  items: Item[];
}) {
  return (
    <select
      className="border p-1"
      defaultValue={current}
      onChange={(e) => (location.href = `/dashboard/${e.target.value}`)}
    >
      {items.map((i) => (
        <option key={i.slug} value={i.slug}>
          {i.name} ({i.role})
        </option>
      ))}
    </select>
  );
}
