"use client"; // Ensures this file runs only on the client

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // Use relative URL in browser
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`; // Vercel Deployment
  return `http://localhost:${process.env.PORT ?? 3000}`; // Local Development
};

/** A set of type-safe React Query hooks for your tRPC API. */
export const api = createTRPCReact<AppRouter>();

/** React Query Configuration for tRPC */
export const trpcConfig = {
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (input, init) => {
        return fetch(input, {
          ...init,
          credentials: "include", // Ensure cookies (session) are sent with requests
        });
      },
    }),
  ],
};

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
