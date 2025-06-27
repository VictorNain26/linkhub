import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { acceptInvite } from "@/app/dashboard/actions/members";

export default async function AcceptInvite({ searchParams }: { searchParams: { token?: string } }) {
  const session = await auth();
  if (!session) redirect(`/login?from=/accept-invite?token=${searchParams.token}`);

  if (!searchParams.token) return <p>Invitation invalide.</p>;

  try {
    await acceptInvite(searchParams.token, session.user.id);
    redirect("/dashboard");
  } catch {
    return <p>Invitation invalide ou expirée.</p>;
  }
}
