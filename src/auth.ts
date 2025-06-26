import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const {
  handlers,   // API Route (⊥ app/api/auth/[...nextauth]/route.ts l’utilise déjà)
  auth,       // server-action helper (⇢ Dashboard, Login)
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // facultatif : autorise plusieurs domaines de redirection
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  session: { strategy: "database" },
  trustHost: true, // utile derrière Vercel / Docker
});
