"use client";

import { useState, useTransition } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import type { VulnerabilityAnalysisResult } from "@/entities/vulnerability/model/types";
import { DependencyParserForm } from "@/features/dependency-parser/ui/dependency-parser-form";
import { DependencyResult } from "@/features/dependency-parser/ui/dependency-result";
import { VulnerabilityResult } from "@/features/vulnerability-analyzer/ui/vulnerability-result";
import { analyzePackageVulnerabilities } from "@/features/vulnerability-analyzer/api/analyze-package";
import { Button } from "@/shared/ui/button";

/**
 * 홈 페이지 뷰 컴포넌트
 * 의존성 파서 폼과 결과를 조합하여 표시합니다.
 */
export function HomeView() {
  const [parsedResult, setParsedResult] = useState<ParsedPackage | null>(null);
  const [vulnResult, setVulnResult] = useState<VulnerabilityAnalysisResult | null>(null);
  const [vulnError, setVulnError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleParseSuccess = (result: ParsedPackage) => {
    setParsedResult(result);
    setVulnResult(null);
    setVulnError(null);
  };

  const handleAnalyzeVulnerabilities = () => {
    if (!parsedResult) return;

    setVulnError(null);
    startTransition(async () => {
      const result = await analyzePackageVulnerabilities(parsedResult);
      if (result.success) {
        setVulnResult(result.data);
      } else {
        setVulnError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <main className="container mx-auto max-w-2xl py-16 px-4">
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
        <section className="mb-8">
          <DependencyParserForm onSuccess={handleParseSuccess} />
        </section>

        {/* 의존성 결과 & 취약점 분석 버튼 */}
        {parsedResult && (
          <section className="space-y-6">
            <DependencyResult result={parsedResult} />

            {/* 취약점 분석 버튼 */}
            {!vulnResult && (
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handleAnalyzeVulnerabilities}
                  disabled={isPending}
                  size="lg"
                  className="w-full"
                >
                  {isPending ? "취약점 분석 중..." : "🔍 취약점 분석"}
                </Button>
                {vulnError && (
                  <p className="text-sm text-destructive">{vulnError}</p>
                )}
              </div>
            )}

            {/* 취약점 결과 */}
            {vulnResult && <VulnerabilityResult result={vulnResult} />}
          </section>
        )}
      </main>
    </div>
  );
}
