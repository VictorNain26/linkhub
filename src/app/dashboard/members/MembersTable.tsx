"use client";

import { updateRole, removeMember } from "../../../actions/members";
import { useTransition } from "react";

type Member = {
  user: { id: string; name: string | null; email: string | null };
  role: "OWNER" | "ADMIN" | "USER";
};

export default function MembersTable({ members }: { members: Member[] }) {
  const [pending, start] = useTransition();

  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Utilisateur</th>
          <th className="p-2">Rôle</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.user.id} className="border-t">
            <td className="p-2">
              {m.user.name ?? m.user.email ?? "?"}
            </td>
            <td className="p-2 text-center">{m.role}</td>
            <td className="p-2 text-right space-x-2">
              {m.role !== "OWNER" && (
                <>
                  {/* changer rôle */}
                  <button
                    disabled={pending}
                    onClick={() =>
                      start(() =>
                        updateRole(
                          m.user.id,
                          m.role === "ADMIN" ? "USER" : "ADMIN",
                        ),
                      )
                    }
                    className="underline text-blue-600 disabled:opacity-40"
                  >
                    {m.role === "ADMIN" ? "Mettre USER" : "Mettre ADMIN"}
                  </button>

                  {/* supprimer membre */}
                  <button
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        if (!confirm("Retirer ce membre ?")) return;
                        await removeMember(m.user.id);
                      })
                    }
                    className="text-red-600 disabled:opacity-40"
                  >
                    Retirer
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
