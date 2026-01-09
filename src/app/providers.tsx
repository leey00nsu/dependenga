"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "border border-white/10 bg-[#101623]/90 text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur data-[type=success]:border-emerald-400/40 data-[type=success]:text-emerald-100 data-[type=error]:border-red-400/40 data-[type=error]:text-red-100",
          descriptionClassName: "text-white/60",
          actionButtonClassName:
            "border border-white/15 bg-white/10 text-white/90 hover:bg-white/20",
          cancelButtonClassName:
            "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
        }}
      />
    </QueryClientProvider>
  );
}
