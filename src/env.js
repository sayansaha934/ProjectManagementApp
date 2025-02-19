import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { Resource } from "sst";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
    AUTH_DISCORD_ID: z.string().min(1),
    AUTH_DISCORD_SECRET: z.string().min(1),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_URL: z.string().url(),
  },

  /**
   * Destructuring works even for nested values in runtimeEnv.
   * You can also customize how environment variables are parsed using the transform option.
   */
  runtimeEnv: {
    AUTH_SECRET: Resource.AUTH_SECRET.value,
    AUTH_DISCORD_ID: Resource.AUTH_DISCORD_ID.value,
    AUTH_DISCORD_SECRET: Resource.AUTH_DISCORD_SECRET.value,
    DATABASE_URL: Resource.DATABASE_URL.value,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_URL: Resource.NEXT_PUBLIC_URL.value,
    NEXTAUTH_URL: Resource.NEXTAUTH_URL.value
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
