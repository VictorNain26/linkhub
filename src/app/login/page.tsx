import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();
  if (session) redirect("/dashboard");

  async function login() {
    "use server";
    await signIn(undefined, { redirectTo: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form action={login}>
        <button
          type="submit"
          className="rounded-lg bg-black text-white px-6 py-3 hover:bg-neutral-800 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
