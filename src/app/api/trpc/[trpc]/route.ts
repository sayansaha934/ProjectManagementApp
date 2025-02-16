import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const runtime = "nodejs"; // Ensure it runs on Edge runtime (Optional)

const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req, // Pass NextRequest directly
    router: appRouter,
    createContext: async () => createTRPCContext({ req }), // Ensure proper context
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC Error at '${path ?? "unknown"}': ${error.message}`);
          }
        : undefined,
  });
};

// Next.js API Route exports (App Router requires named exports)
export { handler as GET, handler as POST };
