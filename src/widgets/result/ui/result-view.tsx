"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import { VulnerabilityPanel } from "@/features/vulnerability-analyzer/ui/vulnerability-panel";
import { useVulnerabilityAnalysis } from "@/features/vulnerability-analyzer/model/use-vulnerability-analysis";
import { ShareUrlButton } from "@/features/result-share/ui/share-url-button";
import { LoadingAnimation } from "@/shared/ui/loading-animation";
import type { BlockData } from "@/features/jenga-tower/ui/jenga-block";

const JengaScene = dynamic(
  () =>
    import("@/features/jenga-tower/ui/jenga-scene").then(
      (mod) => mod.JengaScene
    ),
  { ssr: false }
);

interface ResultViewProps {
  parsedResult: ParsedPackage | null;
  errorMessage?: string | null;
}

/**
 * 결과 페이지 뷰 컴포넌트
 */
export function ResultView({ parsedResult, errorMessage }: ResultViewProps) {
  const [highlightedPackage, setHighlightedPackage] = useState<string | null>(
    null
  );

  const handleBlockHover = useCallback((data: BlockData | null) => {
    setHighlightedPackage(data?.packageName ?? null);
  }, []);

  const handlePackageHover = useCallback((packageName: string | null) => {
    setHighlightedPackage(packageName);
  }, []);

  const {
    data: vulnResult,
    error: vulnError,
    isLoading,
  } = useVulnerabilityAnalysis(parsedResult);

  if (!parsedResult) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 text-center">
          <p className="text-sm text-white/60">
            {errorMessage ?? "결과를 불러올 수 없습니다. 입력 화면으로 돌아가 주세요."}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (vulnError) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 text-center">
          <p className="text-sm text-red-200">{vulnError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[#0b0f14]" />
      <div className="pointer-events-none absolute inset-0 landing-glow" />
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 landing-vignette" />

      {/* Jenga scene as full-screen background */}
      <div className="absolute inset-0 z-0 lg:pr-[360px]">
        {vulnResult && (
          <JengaScene
            packages={vulnResult.packages}
            onBlockHover={handleBlockHover}
            highlightedPackage={highlightedPackage}
          />
        )}
      </div>

      {/* Overlay content */}
      <div className="pointer-events-none relative z-10 mx-auto min-h-screen w-full max-w-6xl px-6 py-6 md:px-10">
        <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-white transition hover:text-white/80"
          >
            Dependenga
          </Link>
          <div className="flex flex-col items-end gap-2 text-right sm:flex-row sm:items-center">
            <div className="text-sm text-white/50">
              {parsedResult.name || "package.json"}
            </div>
            <ShareUrlButton
              dependencies={parsedResult.dependencies}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
            />
          </div>
        </header>

        <aside className="pointer-events-auto mt-6 w-full max-w-sm lg:absolute lg:right-10 lg:top-24 lg:bottom-6 lg:mt-0 lg:max-w-[320px]">
          {vulnResult && (
            <VulnerabilityPanel
              packages={vulnResult.packages}
              onPackageHover={handlePackageHover}
              highlightedPackage={highlightedPackage}
            />
          )}
        </aside>

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[360px] lg:block" />
      </div>
    </div>
  );
}
