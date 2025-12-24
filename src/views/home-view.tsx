"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import type { VulnerabilityAnalysisResult } from "@/entities/vulnerability/model/types";
import { DependencyParserForm } from "@/features/dependency-parser/ui/dependency-parser-form";
import { DependencyResult } from "@/features/dependency-parser/ui/dependency-result";
import { VulnerabilityResult } from "@/features/vulnerability-analyzer/ui/vulnerability-result";
import { analyzePackageVulnerabilities } from "@/features/vulnerability-analyzer/api/analyze-package";
import { Button } from "@/shared/ui/button";

// 3D 씬은 SSR 비활성화 필요
const JengaScene = dynamic(
  () => import("@/features/jenga-tower/ui/jenga-scene").then((mod) => mod.JengaScene),
  { ssr: false }
);

/**
 * 홈 페이지 뷰 컴포넌트
 * 의존성 파서 폼과 결과를 조합하여 표시합니다.
 */
export function HomeView() {
  const [parsedResult, setParsedResult] = useState<ParsedPackage | null>(null);
  const [vulnResult, setVulnResult] = useState<VulnerabilityAnalysisResult | null>(null);
  const [vulnError, setVulnError] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleParseSuccess = (result: ParsedPackage) => {
    setParsedResult(result);
    setVulnResult(null);
    setVulnError(null);
    setShow3D(false);
  };

  const handleAnalyzeVulnerabilities = (testMode: boolean = false) => {
    if (!parsedResult) return;

    setVulnError(null);
    startTransition(async () => {
      const result = await analyzePackageVulnerabilities(parsedResult, testMode);
      if (result.success) {
        setVulnResult(result.data);
      } else {
        setVulnError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <main className="container mx-auto max-w-4xl py-16 px-4">
        {/* 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Dependenga
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            의존성을 분석하고 3D 젠가 타워로 시각화하세요
          </p>
        </header>

        {/* 파서 폼 */}
        <section className="mb-8 max-w-2xl mx-auto">
          <DependencyParserForm onSuccess={handleParseSuccess} />
        </section>

        {/* 의존성 결과 & 취약점 분석 버튼 */}
        {parsedResult && (
          <section className="space-y-6 max-w-2xl mx-auto">
            <DependencyResult result={parsedResult} />

            {/* 취약점 분석 버튼 */}
            {!vulnResult && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => handleAnalyzeVulnerabilities(false)}
                    disabled={isPending}
                    size="lg"
                    className="flex-1"
                  >
                    {isPending ? "분석 중..." : "🔍 취약점 분석"}
                  </Button>
                  <Button
                    onClick={() => handleAnalyzeVulnerabilities(true)}
                    disabled={isPending}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                  >
                    {isPending ? "분석 중..." : "🧪 테스트 모드"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  테스트 모드: 각 심각도(critical/high/medium/low)를 순환 할당
                </p>
                {vulnError && (
                  <p className="text-sm text-destructive">{vulnError}</p>
                )}
              </div>
            )}

            {/* 취약점 결과 */}
            {vulnResult && (
              <>
                <VulnerabilityResult result={vulnResult} />

                {/* 3D 시각화 토글 */}
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShow3D(!show3D)}
                    variant={show3D ? "secondary" : "default"}
                    size="lg"
                  >
                    {show3D ? "📊 리스트 보기" : "🏗️ 3D 젠가 보기"}
                  </Button>
                </div>
              </>
            )}
          </section>
        )}

        {/* 3D 젠가 시각화 */}
        {vulnResult && show3D && (
          <section className="mt-8">
            <JengaScene packages={vulnResult.packages} />
            <p className="text-center text-sm text-muted-foreground mt-4">
              마우스 드래그로 회전, 스크롤로 확대/축소
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
