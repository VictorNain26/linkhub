import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenue,&nbsp;{session?.user?.name ?? "inconnu"} !
      </h1>
      <p className="text-sm text-gray-500">
        Ici tu ajouteras plus tard la liste de tes liens, tes stats, etc.
      </p>
    </main>
  );
}
