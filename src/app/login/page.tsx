import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Login({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from = '/dashboard' } = await searchParams;
  const session = await auth();
  if (session) redirect(from);

  async function login() {
    'use server';
    await signIn('google', { redirectTo: from });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background text-foreground">
      <form action={login}>
        <button type="submit" className="rounded-lg bg-primary text-primary-foreground px-6 py-3 hover:opacity-90 transition">
          Se connecter avec Google
        </button>
      </form>
    </div>
  );
}
