"use client";

import { logout } from "./actions/logout";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm underline text-red-600 hover:text-red-800"
      >
        Déconnexion
      </button>
    </form>
  );
}
