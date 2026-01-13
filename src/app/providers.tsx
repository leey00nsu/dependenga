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
          classNames: {
            toast:
              "!relative !flex !w-full !items-center !gap-3 !rounded-3xl !border-2 !border-sky-200 !bg-white/95 !px-4 !py-3 !text-slate-700 !shadow-[0_12px_24px_rgba(90,140,170,0.22)] !backdrop-blur",
            title: "!text-sm !font-semibold !text-slate-700",
            description: "!text-xs !text-slate-500",
            content: "!flex !flex-col !gap-1 !text-left",
            icon:
              "!flex !h-8 !w-8 !items-center !justify-center !rounded-full !border-2 !border-sky-200 !bg-white !text-sky-600 !shadow-[0_6px_10px_rgba(90,140,170,0.18)]",
            success: "!text-sky-600",
            error: "!text-rose-500",
            actionButton:
              "!rounded-full !border-2 !border-sky-200 !bg-white !px-3 !py-1 !text-xs !text-slate-600 !shadow-[0_6px_10px_rgba(90,140,170,0.18)] !transition hover:!scale-[1.02] hover:!bg-sky-50 active:!scale-[0.98]",
            cancelButton:
              "!rounded-full !border-2 !border-sky-100 !bg-white/80 !px-3 !py-1 !text-xs !text-slate-500 !shadow-[0_6px_10px_rgba(90,140,170,0.12)] !transition hover:!scale-[1.02] hover:!bg-white active:!scale-[0.98]",
          },
        }}
      />
    </QueryClientProvider>
  );
}
