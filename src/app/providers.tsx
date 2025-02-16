"use client";

import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { api, trpcConfig } from "~/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => api.createClient(trpcConfig));
  
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </SessionProvider>
  );
}
