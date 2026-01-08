"use client";

import dynamic from "next/dynamic";
import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import type { VulnerabilityAnalysisResult } from "@/entities/vulnerability/model/types";
import {
  DependencyParserForm,
  type DependencyParserFormHandle,
} from "@/features/dependency-parser/ui/dependency-parser-form";
import { analyzePackageVulnerabilities } from "@/features/vulnerability-analyzer/api/analyze-package";
import { VulnerabilityPanel } from "@/features/vulnerability-analyzer/ui/vulnerability-panel";
import { LoadingAnimation } from "@/shared/ui/loading-animation";
import { CubeVisual } from "@/shared/ui/cube-visual";
import { encodeDependencies, SHARE_QUERY_LIMIT } from "@/shared/lib/share-query";
import type { BlockData } from "@/features/jenga-tower/ui/jenga-block";

// 3D 씬은 SSR 비활성화 필요
const JengaScene = dynamic(
  () =>
    import("@/features/jenga-tower/ui/jenga-scene").then(
      (mod) => mod.JengaScene
    ),
  { ssr: false, loading: () => <JengaLoadingPlaceholder /> }
);

// dotLottie 컴포넌트 동적 로드 (SSR 비활성화)
const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

/**
 * 젠가 로딩 플레이스홀더 (3D 씬 로딩 중)
 * LoadingAnimation과 동일한 dotLottie 애니메이션 사용
 */
function JengaLoadingPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent text-white/70">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4">
          <DotLottieReact
            src="/animations/loading.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <p className="font-medium">Building tower...</p>
      </div>
    </div>
  );
}

/**
 * 앱 상태 타입
 */
type AppState = "initial" | "loading" | "result";

interface ShareWarningState {
  length: number;
  payload: ParsedPackage;
  testMode: boolean;
}

/**
 * 홈 페이지 뷰 컴포넌트
 * Minimal, playful, modern developer tool
 */
export function HomeView() {
  const [appState, setAppState] = useState<AppState>("initial");
  const [parsedResult, setParsedResult] = useState<ParsedPackage | null>(null);
  const [vulnResult, setVulnResult] =
    useState<VulnerabilityAnalysisResult | null>(null);
  const [vulnError, setVulnError] = useState<string | null>(null);
  const [highlightedPackage, setHighlightedPackage] = useState<string | null>(
    null
  );
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [shareWarning, setShareWarning] = useState<ShareWarningState | null>(null);
  const formRef = useRef<DependencyParserFormHandle | null>(null);
  const dragCounterRef = useRef(0);

  const resetGlobalDrag = useCallback(() => {
    dragCounterRef.current = 0;
    setIsGlobalDragging(false);
  }, []);

  const handleParseSuccess = (result: ParsedPackage) => {
    setParsedResult(result);
    setVulnResult(null);
    setVulnError(null);
    // 파싱 성공 시 URL 길이 체크 후 분석 시작
    if (!checkShareLength(result, false)) return;
    handleAnalyzeWithData(result, false);
  };

  const handleAnalyze = (testMode: boolean = false) => {
    if (!parsedResult) return;
    if (!checkShareLength(parsedResult, testMode)) return;
    handleAnalyzeWithData(parsedResult, testMode);
  };

  const handleAnalyzeWithData = (data: ParsedPackage, testMode: boolean) => {
    setAppState("loading");
    setVulnError(null);

    startTransition(async () => {
      const result = await analyzePackageVulnerabilities(data, testMode);
      if (result.success) {
        setVulnResult(result.data);
        setAppState("result");
      } else {
        setVulnError(result.error);
        setAppState("initial");
      }
    });
  };

  const checkShareLength = (data: ParsedPackage, testMode: boolean) => {
    const encoded = encodeDependencies(data.dependencies);
    if (encoded.length > SHARE_QUERY_LIMIT) {
      setShareWarning({ length: encoded.length, payload: data, testMode });
      return false;
    }
    setShareWarning(null);
    return true;
  };

  const handleShareWarningContinue = () => {
    if (!shareWarning) return;
    const { payload, testMode } = shareWarning;
    setShareWarning(null);
    handleAnalyzeWithData(payload, testMode);
  };

  const handleBlockHover = useCallback((data: BlockData | null) => {
    setHighlightedPackage(data?.packageName ?? null);
  }, []);

  const handlePackageHover = useCallback((packageName: string | null) => {
    setHighlightedPackage(packageName);
  }, []);

  const handleReset = () => {
    setAppState("initial");
    setParsedResult(null);
    setVulnResult(null);
    setVulnError(null);
    setHighlightedPackage(null);
    setSelectedPackage(null);
    setShareWarning(null);
  };

  // 블록 클릭 핸들러 - 상세 정보 표시
  const handleBlockClick = useCallback((data: BlockData) => {
    setSelectedPackage(data.packageName);
    // TODO: 상세 정보 모달 또는 패널 확장 구현
  }, []);

  // 패키지 클릭 핸들러 - 상세 정보 표시
  const handlePackageClick = useCallback((packageName: string) => {
    setSelectedPackage(packageName);
    // TODO: 상세 정보 모달 또는 패널 확장 구현
  }, []);

  useEffect(() => {
    const hasFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes("Files");

    const handleDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      dragCounterRef.current += 1;
      setIsGlobalDragging(true);
    };

    const handleDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) {
        setIsGlobalDragging(false);
      }
    };

    const handleDragOver = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      resetGlobalDrag();
      if (appState !== "initial") return;
      const file = event.dataTransfer?.files?.[0] ?? null;
      if (file) {
        formRef.current?.handleFileSelect(file);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [appState, resetGlobalDrag]);

  // Initial State - 입력 카드
  if (appState === "initial") {
    return (
      <div className="relative min-h-screen overflow-x-hidden text-white">
        <div className="pointer-events-none absolute inset-0 bg-[#0b0f14]" />
        <div className="pointer-events-none absolute inset-0 landing-glow" />
        <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
        <div className="pointer-events-none absolute inset-0 landing-vignette" />

        <div className="relative z-10 flex min-h-screen flex-col px-6 py-6 md:px-12">
          {isGlobalDragging && (
            <div className="pointer-events-none absolute inset-0 z-20 border border-dashed border-white/40 bg-white/5 backdrop-blur-sm">
              <div className="flex h-full flex-col items-center justify-center gap-3 text-white/80">
                <svg
                  aria-hidden="true"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 4v10m0-10 4 4m-4-4-4 4M5 20h14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                </svg>
                <p className="text-sm">package.json 파일을 놓아 업로드하세요</p>
              </div>
            </div>
          )}
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Dependenga
            </h1>
          </header>

          <main className="flex flex-1 flex-col items-center justify-center gap-8 sm:gap-10 md:gap-12 ">
            <div className="relative h-[min(33vw,33vh)] w-[min(33vw,33vh)]">
              <CubeVisual
                className="drop-shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                idPrefix="landing-cube"
                title="3x3x3 큐브 비주얼"
              />
            </div>

            <div className="w-full max-w-3xl">
              <DependencyParserForm
                ref={formRef}
                onSuccess={handleParseSuccess}
                variant="landing"
                onDropHandled={resetGlobalDrag}
              />

              {parsedResult && (
                <div className="mt-4 space-y-3 text-center">
                  <div className="text-sm text-white/60">
                    {parsedResult.dependencies.length} dependencies found -
                    analyzing...
                  </div>

                  <button
                    onClick={() => handleAnalyze(true)}
                    disabled={isPending}
                    className="w-full text-sm text-white/40 transition-colors hover:text-white/70"
                  >
                    🧪 Test mode (simulate vulnerabilities)
                  </button>
                </div>
              )}

              {vulnError && (
                <p className="mt-3 text-center text-sm text-red-200">
                  {vulnError}
                </p>
              )}

              {shareWarning && (
                <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-200/10 p-4 text-sm text-amber-100/90">
                  <p className="font-medium">공유 URL이 길어질 수 있습니다.</p>
                  <p className="mt-2 text-xs text-amber-100/70">
                    현재 길이: {shareWarning.length}자 (권장 최대: {SHARE_QUERY_LIMIT}자)
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShareWarning(null)}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleShareWarningContinue}
                      className="rounded-full border border-amber-300/40 bg-amber-200/20 px-4 py-2 text-xs text-white transition hover:bg-amber-200/30"
                    >
                      계속 진행
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Loading State - Lottie 또는 CSS 애니메이션
  if (appState === "loading") {
    return <LoadingAnimation />;
  }

  // Result State - dashboard.png 기준 레이아웃
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
            onBlockClick={handleBlockClick}
            highlightedPackage={highlightedPackage}
          />
        )}
      </div>

      {/* Overlay content */}
      <div className="pointer-events-none relative z-10 mx-auto min-h-screen w-full max-w-6xl px-6 py-6 md:px-10">
        <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="text-2xl font-semibold tracking-tight text-white"
          >
            Dependenga
          </button>
          <div className="text-sm text-white/50">
            {parsedResult?.name || "package.json"}
          </div>
        </header>

        <aside className="pointer-events-auto mt-6 w-full max-w-sm lg:absolute lg:right-10 lg:top-24 lg:bottom-6 lg:mt-0 lg:max-w-[320px]">
          {vulnResult && (
            <VulnerabilityPanel
              packages={vulnResult.packages}
              onPackageHover={handlePackageHover}
              onPackageClick={handlePackageClick}
              highlightedPackage={highlightedPackage}
            />
          )}
        </aside>

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[360px] lg:block" />
      </div>
    </div>
  );
}
