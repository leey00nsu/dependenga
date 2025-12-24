"use client";

import { useState } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import { DependencyParserForm } from "@/features/dependency-parser/ui/dependency-parser-form";
import { DependencyResult } from "@/features/dependency-parser/ui/dependency-result";

/**
 * 홈 페이지 뷰 컴포넌트
 * 의존성 파서 폼과 결과를 조합하여 표시합니다.
 */
export function HomeView() {
  const [result, setResult] = useState<ParsedPackage | null>(null);

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
        <section className="mb-12">
          <DependencyParserForm onSuccess={setResult} />
        </section>

        {/* 결과 표시 */}
        {result && (
          <section>
            <DependencyResult result={result} />
          </section>
        )}
      </main>
    </div>
  );
}
