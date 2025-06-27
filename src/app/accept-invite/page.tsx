import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { acceptInvite } from "@/actions/members";

export default async function AcceptInvite({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  /* 1. extraire le token */
  const { token } = await searchParams;
  if (!token) return <p>Invitation invalide.</p>;

  /* 2. vérifier la session */
  const session = await auth();
  if (!session) {
    // pas loggué → on redirige vers login puis retour
    redirect(`/login?from=/accept-invite?token=${encodeURIComponent(token)}`);
  }

  /* 3. S’assurer que l’ID utilisateur existe */
  const userId = session.user?.id;
  if (!userId) return <p>Session invalide.</p>;

  /* 4. tenter d’accepter l’invitation */
  try {
    await acceptInvite(token, userId); // ← ne déclenche plus le catch
  } catch {
    return <p>Invitation invalide ou expirée.</p>;
  }

  /* 5. redirection finale (hors du try/catch) */
  redirect("/dashboard");
}
