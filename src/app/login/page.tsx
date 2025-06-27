import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function Login({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const from = searchParams?.from ?? "/dashboard";

  /* Déjà connecté ? */
  const session = await auth();
  if (session) redirect(from);

  /* Action serveur paramétrée avec le bon callback */
  async function login() {
    "use server";
    await signIn("google", { redirectTo: from });
  }

  /* Formulaire de connexion */
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form action={login}>
        <button
          type="submit"
          className="rounded-lg bg-black text-white px-6 py-3 hover:bg-neutral-800 transition"
        >
          Se connecter avec Google
        </button>
      </form>
    </div>
  );
}
