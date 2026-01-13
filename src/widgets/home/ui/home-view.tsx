"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import {
  DependencyParserForm,
  type DependencyParserFormHandle,
} from "@/features/dependency-parser/ui/dependency-parser-form";
import { SHARE_QUERY_LIMIT } from "@/shared/lib/share-query";
import { buildShareUrl, getShareEncoding } from "@/features/result-share/model/share-utils";
import { DependengaLogo } from "@/shared/ui/dependenga-logo";
interface ShareWarningState {
  length: number;
  payload: ParsedPackage;
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
    if (!checkShareLength(result)) return;
    goToResult(result);
  };

  const goToResult = (data: ParsedPackage) => {
    const { url } = buildShareUrl(data.dependencies);
    startTransition(() => {
      router.push(url);
    });
  };

  const checkShareLength = (data: ParsedPackage) => {
    const { length, tooLong } = getShareEncoding(data.dependencies);
    if (tooLong) {
      setShareWarning({ length, payload: data });
      return false;
    }
    setShareWarning(null);
    return true;
  };

  const handleShareWarningContinue = () => {
    if (!shareWarning) return;
    const { payload } = shareWarning;
    setShareWarning(null);
    goToResult(payload);
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
    <div className="relative min-h-screen overflow-x-hidden text-slate-700">
      <div className="pointer-events-none absolute inset-0 v2-background" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 md:px-12">
        {isGlobalDragging && (
          <div className="pointer-events-none absolute inset-0 z-20 border-2 border-dashed border-sky-300 bg-white/70 backdrop-blur-sm">
            <div className="flex h-full flex-col items-center justify-center gap-3 text-sky-700">
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
          <DependengaLogo as="h1" className="text-3xl sm:text-4xl" />
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-8 sm:gap-10 md:gap-12">
          <div className="relative w-[min(280px,70vw)] sm:w-[min(360px,40vw)]">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/images/landing-image.png"
                alt="Dependenga 로고 이미지"
                fill
                className="object-contain drop-shadow-[0_18px_30px_rgba(90,150,185,0.35)]"
                priority
              />
            </div>
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
                <div className="text-sm text-slate-500">
                  {parsedResult.dependencies.length} dependencies found -
                  analyzing...
                </div>
              </div>
            )}

            {shareWarning && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                <p className="font-medium">공유 URL이 길어질 수 있습니다.</p>
                <p className="mt-2 text-xs text-amber-600">
                  현재 길이: {shareWarning.length}자 (권장 최대: {SHARE_QUERY_LIMIT}자)
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShareWarning(null)}
                    className="v2-button-secondary v2-pressable px-4 py-2 text-xs text-amber-700"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleShareWarningContinue}
                    className="v2-button-primary v2-pressable px-4 py-2 text-xs"
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
