"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButton({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={isSignedIn ? () => signOut() : () => signIn("discord")}
    >
      {isSignedIn ? "Sign Out" : "Sign In with Discord"}
    </button>
  );
}
