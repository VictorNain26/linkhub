import prisma from "@/lib/prisma";

export default async function Home() {
  const links = await prisma.link.findMany({
    take: 10,
    orderBy: { clicks: "desc" },
    include: { user: true },
  });

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Top links</h1>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.id} className="flex gap-2">
            <span className="font-mono">{l.slug}</span>
            <a href={l.url} className="text-blue-600 hover:underline">
              {l.url}
            </a>
            <span className="text-gray-500 ml-auto">{l.clicks} hits</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
