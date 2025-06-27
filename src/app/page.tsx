export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">👋 Bienvenue sur LinkHub</h1>
      <p>Crée ton espace de liens en un clic.</p>
      <a
        href="/login"
        className="bg-black text-white px-6 py-3 rounded hover:opacity-90"
      >
        Se connecter
      </a>
    </main>
  );
}
