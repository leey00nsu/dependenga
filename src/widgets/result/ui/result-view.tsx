"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import { VulnerabilityPanel } from "@/features/vulnerability-analyzer/ui/vulnerability-panel";
import { useVulnerabilityAnalysis } from "@/features/vulnerability-analyzer/model/use-vulnerability-analysis";
import { ShareUrlButton } from "@/features/result-share/ui/share-url-button";
import { LoadingAnimation } from "@/shared/ui/loading-animation";
import type { BlockData } from "@/features/jenga-tower/ui/jenga-block";
import { DependengaLogo } from "@/shared/ui/dependenga-logo";

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
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (!parsedResult) {
      return;
    }
    if (typeof window === "undefined") {
      setIsPanelOpen(true);
      return;
    }
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setIsPanelOpen(isDesktop);
  }, [parsedResult]);

  const handleBlockHover = useCallback((data: BlockData | null) => {
    setHighlightedPackage(data?.packageName ?? null);
  }, []);

  const handlePackageHover = useCallback((packageName: string | null) => {
    setHighlightedPackage(packageName);
  }, []);
  const handlePanelToggle = useCallback(() => {
    setIsPanelOpen((prev) => !prev);
  }, []);

  const {
    data: vulnResult,
    error: vulnError,
    isLoading,
  } = useVulnerabilityAnalysis(parsedResult);

  if (!parsedResult) {
    return (
      <div className="min-h-screen v2-background text-slate-600">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 text-center">
          <div className="v2-panel rounded-3xl px-6 py-5 text-sm">
            {errorMessage ?? "결과를 불러올 수 없습니다. 입력 화면으로 돌아가 주세요."}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (vulnError) {
    return (
      <div className="min-h-screen v2-background text-slate-600">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 text-center">
          <div className="v2-panel rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-600">
            {vulnError}
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    parsedResult.name && parsedResult.name !== "shared"
      ? parsedResult.name
      : parsedResult.name
        ? null
        : "package.json";

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-700">
      <div className="pointer-events-none absolute inset-0 v2-background" />

      <div
        className={`absolute inset-0 z-0 transition-[padding] duration-300 ${
          isPanelOpen ? "lg:pr-[360px]" : "lg:pr-0"
        }`}
      >
        {vulnResult && (
          <JengaScene
            packages={vulnResult.packages}
            onBlockHover={handleBlockHover}
            highlightedPackage={highlightedPackage}
          />
        )}
      </div>

      <div className="pointer-events-none relative z-10 mx-auto min-h-screen w-full max-w-6xl px-6 py-8 md:px-10">
        <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3">
          <DependengaLogo href="/" className="text-3xl sm:text-4xl" />
          <div className="flex flex-col items-end gap-2 text-right sm:flex-row sm:items-center">
            {displayName && (
              <div className="v2-pill px-4 py-1 text-sm text-slate-600">
                {displayName}
              </div>
            )}
            <ShareUrlButton
              dependencies={parsedResult.dependencies}
              className="v2-button-secondary v2-pressable px-4 py-2 text-xs text-sky-700 sm:text-sm"
            />
          </div>
        </header>

        <aside className="pointer-events-auto mx-auto mt-6 w-full max-w-sm lg:absolute lg:right-10 lg:top-24 lg:bottom-6 lg:mt-0 lg:max-w-[340px] lg:mx-0">
          {vulnResult && (
            <>
              <div>
                <button
                  type="button"
                  onClick={handlePanelToggle}
                  aria-expanded={isPanelOpen}
                  aria-controls="vulnerability-panel"
                  className="v2-panel v2-pressable flex w-full items-center justify-between rounded-3xl px-4 py-3 text-sm text-slate-700"
                >
                  <span className="font-semibold">취약점 리스트</span>
                  <span className="text-xs text-slate-500">
                    {isPanelOpen ? "접기" : "열기"}
                  </span>
                </button>
              </div>
              <div
                id="vulnerability-panel"
                className={`transition-[max-height,opacity] duration-300 ease-out ${
                  isPanelOpen
                    ? "mt-4 max-h-[calc(100dvh-160px)] opacity-100 overflow-visible lg:mt-4 lg:max-h-[calc(100dvh-120px)]"
                    : "mt-0 max-h-0 opacity-0 pointer-events-none overflow-hidden lg:mt-0 lg:max-h-0"
                }`}
              >
                <VulnerabilityPanel
                  packages={vulnResult.packages}
                  onPackageHover={handlePackageHover}
                  highlightedPackage={highlightedPackage}
                />
              </div>
            </>
          )}
        </aside>

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[360px] lg:block" />
      </div>
    </div>
  );
}
