"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import {
  DependencyParserForm,
  type DependencyParserFormHandle,
} from "@/features/dependency-parser/ui/dependency-parser-form";
import { CubeVisual } from "@/shared/ui/cube-visual";
import { SHARE_QUERY_LIMIT } from "@/shared/lib/share-query";
import { buildShareUrl, getShareEncoding } from "@/features/result-share/model/share-utils";
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
  const [parsedResult, setParsedResult] = useState<ParsedPackage | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [shareWarning, setShareWarning] = useState<ShareWarningState | null>(null);
  const router = useRouter();
  const formRef = useRef<DependencyParserFormHandle | null>(null);
  const dragCounterRef = useRef(0);

  const resetGlobalDrag = useCallback(() => {
    dragCounterRef.current = 0;
    setIsGlobalDragging(false);
  }, []);

  const handleParseSuccess = (result: ParsedPackage) => {
    setParsedResult(result);
    if (!checkShareLength(result, false)) return;
    goToResult(result);
  };

  const handleAnalyze = (testMode: boolean = false) => {
    if (!parsedResult) return;
    if (!checkShareLength(parsedResult, testMode)) return;
    goToResult(parsedResult, testMode);
  };

  const goToResult = (data: ParsedPackage, testMode: boolean = false) => {
    const { url } = buildShareUrl(data.dependencies);
    startTransition(() => {
      router.push(testMode ? `${url}&test=1` : url);
    });
  };

  const checkShareLength = (data: ParsedPackage, testMode: boolean) => {
    const { length, tooLong } = getShareEncoding(data.dependencies);
    if (tooLong) {
      setShareWarning({ length, payload: data, testMode });
      return false;
    }
    setShareWarning(null);
    return true;
  };

  const handleShareWarningContinue = () => {
    if (!shareWarning) return;
    const { payload, testMode } = shareWarning;
    setShareWarning(null);
    goToResult(payload, testMode);
  };

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
      if (isPending) return;
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
  }, [isPending, resetGlobalDrag]);

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
