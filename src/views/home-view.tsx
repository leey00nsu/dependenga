"use client";

import dynamic from "next/dynamic";
import { useState, useTransition, useCallback } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import type { VulnerabilityAnalysisResult } from "@/entities/vulnerability/model/types";
import { DependencyParserForm } from "@/features/dependency-parser/ui/dependency-parser-form";
import { analyzePackageVulnerabilities } from "@/features/vulnerability-analyzer/api/analyze-package";
import { VulnerabilityPanel } from "@/features/vulnerability-analyzer/ui/vulnerability-panel";
import { Button } from "@/shared/ui/button";
import type { BlockData } from "@/features/jenga-tower/ui/jenga-block";

// 3D 씬은 SSR 비활성화 필요
const JengaScene = dynamic(
  () => import("@/features/jenga-tower/ui/jenga-scene").then((mod) => mod.JengaScene),
  { ssr: false, loading: () => <JengaLoadingPlaceholder /> }
);

/**
 * 젠가 로딩 플레이스홀더
 */
function JengaLoadingPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#E8F5E9" }}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Building tower...</p>
      </div>
    </div>
  );
}

/**
 * 앱 상태 타입
 */
type AppState = "initial" | "loading" | "result";

/**
 * 홈 페이지 뷰 컴포넌트
 * Minimal, playful, modern developer tool
 */
export function HomeView() {
  const [appState, setAppState] = useState<AppState>("initial");
  const [parsedResult, setParsedResult] = useState<ParsedPackage | null>(null);
  const [vulnResult, setVulnResult] = useState<VulnerabilityAnalysisResult | null>(null);
  const [vulnError, setVulnError] = useState<string | null>(null);
  const [highlightedPackage, setHighlightedPackage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleParseSuccess = (result: ParsedPackage) => {
    setParsedResult(result);
    setVulnResult(null);
    setVulnError(null);
  };

  const handleAnalyze = (testMode: boolean = false) => {
    if (!parsedResult) return;

    setAppState("loading");
    setVulnError(null);
    
    startTransition(async () => {
      const result = await analyzePackageVulnerabilities(parsedResult, testMode);
      if (result.success) {
        setVulnResult(result.data);
        setAppState("result");
      } else {
        setVulnError(result.error);
        setAppState("initial");
      }
    });
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
  };

  // Initial State - 입력 카드
  if (appState === "initial") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#E8F5E9" }}
      >
        <div className="w-full max-w-xl animate-in fade-in duration-500">
          {/* 로고 */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              Dependenga
            </h1>
            <p className="mt-2 text-gray-600">
              Visualize your dependencies as a Jenga tower
            </p>
          </header>

          {/* 입력 카드 */}
          <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-6 border border-gray-100">
            <DependencyParserForm onSuccess={handleParseSuccess} />
            
            {/* 분석 버튼 */}
            {parsedResult && (
              <div className="mt-6 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="text-sm text-gray-500 text-center">
                  {parsedResult.dependencies.length} dependencies found
                </div>
                
                <Button
                  onClick={() => handleAnalyze(false)}
                  disabled={isPending}
                  size="lg"
                  className="w-full h-12 text-base font-medium bg-gray-800 hover:bg-gray-900"
                >
                  {isPending ? "Analyzing..." : "Analyze Dependencies"}
                </Button>
                
                <button
                  onClick={() => handleAnalyze(true)}
                  disabled={isPending}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  🧪 Test mode (simulate vulnerabilities)
                </button>
                
                {vulnError && (
                  <p className="text-sm text-red-500 text-center">{vulnError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading State - 젠가 빌딩 애니메이션
  if (appState === "loading") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E8F5E9" }}
      >
        <div className="text-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-3 mb-4">
            {/* 간단한 블록 쌓기 애니메이션 */}
            <div className="flex gap-1">
              <div className="w-8 h-3 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-8 h-3 bg-gray-400 rounded-sm animate-bounce" style={{ animationDelay: "100ms" }} />
              <div className="w-8 h-3 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "200ms" }} />
            </div>
            <div className="flex gap-1 -mt-1">
              <div className="w-3 h-8 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "300ms" }} />
              <div className="w-3 h-8 bg-gray-400 rounded-sm animate-bounce" style={{ animationDelay: "400ms" }} />
              <div className="w-3 h-8 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "500ms" }} />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Analyzing dependencies...</p>
          <p className="text-sm text-gray-400 mt-1">Building your Jenga tower</p>
        </div>
      </div>
    );
  }

  // Result State - 60/40 분할 레이아웃
  return (
    <div 
      className="h-screen flex flex-col"
      style={{ backgroundColor: "#E8F5E9" }}
    >
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
        <button
          onClick={handleReset}
          className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Dependenga
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {parsedResult?.name || "package.json"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            New Analysis
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 - 60/40 분할 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 3D 젠가 (60%) */}
        <div className="w-[60%] h-full">
          {vulnResult && (
            <JengaScene 
              packages={vulnResult.packages}
              onBlockHover={handleBlockHover}
              highlightedPackage={highlightedPackage}
            />
          )}
        </div>

        {/* 오른쪽: Vulnerability Panel (40%) */}
        <div className="w-[40%] h-full p-4">
          {vulnResult && (
            <VulnerabilityPanel
              packages={vulnResult.packages}
              onPackageHover={handlePackageHover}
              highlightedPackage={highlightedPackage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
