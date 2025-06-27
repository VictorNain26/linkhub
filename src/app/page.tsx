import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">👋 Bienvenue sur LinkHub</h1>
      <p>Crée ton espace de liens en un clic.</p>

      <Link
        href="/login"
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition"
      >
        Commencer
      </Link>
    </main>
  );
}
