import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { db } from "~/server/db";
import { Resource } from "sst";
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
      clientId: Resource.AUTH_DISCORD_ID.value,
      clientSecret: Resource.AUTH_DISCORD_SECRET.value,
    }),
  ],
  secret: '6uh9Z9gSwJpthE2C6M3NX8194AzP9dVNOGBDRt4Amis=',
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
