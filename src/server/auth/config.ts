import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  debug: process.env.NEXTAUTH_DEBUG === 'true',
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  // events: {
  //   async signIn(message) {
  //     console.log('Sign in event:', message);
  //   },
  //   async signOut(message) {
  //     console.log('Sign out event:', message);
  //   },
  // },
} satisfies NextAuthConfig;
