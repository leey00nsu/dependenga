"use client";

import { useState, useTransition } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import { parsePackageJson, type ParseResult } from "@/features/dependency-parser/api/parse-package-json";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface DependencyParserFormProps {
  /** 파싱 성공 시 호출되는 콜백 */
  onSuccess?: (result: ParsedPackage) => void;
}

type InputMode = "text" | "github";

/**
 * 의존성 파서 입력 폼 컴포넌트
 * package.json 직접 입력 또는 GitHub URL 입력을 지원합니다.
 */
export function DependencyParserForm({ onSuccess }: DependencyParserFormProps) {
  const [mode, setMode] = useState<InputMode>("text");
  const [packageJsonText, setPackageJsonText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      let result: ParseResult;

      if (mode === "text") {
        result = await parsePackageJson({ mode: "text", packageJsonText });
      } else {
        result = await parsePackageJson({ mode: "github", githubUrl });
      }

      if (result.success) {
        onSuccess?.(result.data);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as InputMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">직접 입력</TabsTrigger>
          <TabsTrigger value="github">GitHub URL</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="package-json-text" className="text-sm font-medium">
              package.json 내용
            </label>
            <Textarea
              id="package-json-text"
              placeholder='{ "name": "my-project", "dependencies": { ... } }'
              value={packageJsonText}
              onChange={(e) => setPackageJsonText(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
        </TabsContent>

        <TabsContent value="github" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="github-url" className="text-sm font-medium">
              GitHub 레포지토리 URL
            </label>
            <Input
              id="github-url"
              type="url"
              placeholder="https://github.com/owner/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              레포지토리 루트의 package.json을 자동으로 가져옵니다.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "분석 중..." : "의존성 분석"}
      </Button>
    </form>
  );
}
