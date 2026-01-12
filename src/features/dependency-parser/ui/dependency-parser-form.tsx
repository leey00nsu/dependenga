"use client";

import { forwardRef, useImperativeHandle, useRef, useState, useTransition } from "react";
import type { ParsedPackage } from "@/entities/dependency/model/types";
import { parsePackageJson, type ParseResult } from "@/features/dependency-parser/api/parse-package-json";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { cn } from "@/shared/lib/utils";

interface DependencyParserFormProps {
  /** 파싱 성공 시 호출되는 콜백 */
  onSuccess?: (result: ParsedPackage) => void;
  variant?: "default" | "landing";
  onDropHandled?: () => void;
}

type InputMode = "text" | "github";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
    >
      <path
        d="M8.75 15a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5Zm4.42-1.33 3.16 3.16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export type DependencyParserFormHandle = {
  handleFileSelect: (file: File | null) => void;
};

/**
 * 의존성 파서 입력 폼 컴포넌트
 * package.json 직접 입력 또는 GitHub URL 입력을 지원합니다.
 */
export const DependencyParserForm = forwardRef<DependencyParserFormHandle, DependencyParserFormProps>(function DependencyParserForm({
  onSuccess,
  variant = "default",
  onDropHandled,
}: DependencyParserFormProps, ref) {
  const [mode, setMode] = useState<InputMode>("text");
  const [packageJsonText, setPackageJsonText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isLanding = variant === "landing";
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setError("package.json 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      const text = await file.text();
      setMode("text");
      setPackageJsonText(text);
      setUploadedFileName(file.name);
      setError(null);
    } catch {
      setError("파일을 읽는 중 오류가 발생했습니다.");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    onDropHandled?.();
    const file = event.dataTransfer.files?.[0] ?? null;
    void handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  useImperativeHandle(ref, () => ({
    handleFileSelect,
  }));

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
    <form onSubmit={handleSubmit} className={cn("space-y-4", isLanding && "space-y-7")}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          void handleFileSelect(file);
          event.target.value = "";
        }}
      />
      <Tabs value={mode} onValueChange={(v) => setMode(v as InputMode)}>
        <div
          className={cn(
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
            isLanding && "sm:gap-6"
          )}
        >
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-md border border-border px-3 py-1 text-sm text-foreground/80 transition hover:border-ring hover:text-foreground",
              isLanding &&
                "v2-button-secondary px-5 py-2 text-sm text-sky-700 hover:brightness-105"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            파일 업로드
          </button>
          <TabsList
            className={cn(
              "grid w-full grid-cols-2 sm:w-auto",
              isLanding &&
                "v2-toggle mx-auto w-full max-w-[240px] sm:mx-0"
            )}
          >
            <TabsTrigger
              value="text"
              className={cn(
                isLanding &&
                  "v2-toggle-item text-sm text-sky-700 data-[state=active]:text-white"
              )}
            >
              직접 입력
            </TabsTrigger>
            <TabsTrigger
              value="github"
              className={cn(
                isLanding &&
                  "v2-toggle-item text-sm text-sky-700 data-[state=active]:text-white"
              )}
            >
              GitHub URL
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="text" className={cn("space-y-4", isLanding && "space-y-4")}>
          {isLanding ? (
            <div>
              <div
                className={cn(
                  "v2-input-panel p-5 sm:p-6 transition",
                  isDragging && "border-sky-300 shadow-[0_0_0_4px_rgba(125,195,234,0.25)]"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label htmlFor="package-json-text" className="sr-only">
                  package.json 내용
                </label>
                <Textarea
                  id="package-json-text"
                  placeholder='{ "name": "my-project", "dependencies": { ... } }'
                  value={packageJsonText}
                  onChange={(e) => {
                    setPackageJsonText(e.target.value);
                    setUploadedFileName(null);
                  }}
                  rows={8}
                  className="min-h-[160px] border-transparent bg-transparent font-mono text-sm text-slate-700 placeholder:text-slate-400 shadow-none focus-visible:border-transparent focus-visible:ring-0 sm:min-h-[200px]"
                />
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-slate-500">
                  <p>package.json 전체를 붙여넣거나 드래그하여 업로드하세요.</p>
                  {uploadedFileName && (
                    <p className="mt-1 text-slate-500">업로드됨: {uploadedFileName}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="v2-button-primary h-11 px-7 text-sm"
                >
                  {isPending ? "분석 중..." : "Analyze"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="package-json-text" className="text-sm font-medium">
                package.json 내용
              </label>
              <div
                className={cn(
                  "rounded-lg border border-dashed border-input p-3 transition",
                  isDragging && "border-ring bg-muted/30"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Textarea
                  id="package-json-text"
                  placeholder='{ "name": "my-project", "dependencies": { ... } }'
                  value={packageJsonText}
                  onChange={(e) => {
                    setPackageJsonText(e.target.value);
                    setUploadedFileName(null);
                  }}
                  rows={12}
                  className="border-transparent font-mono text-sm shadow-none"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>package.json 전체를 붙여넣거나 드래그하여 업로드하세요.</span>
                {uploadedFileName && <span>업로드됨: {uploadedFileName}</span>}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="github" className={cn("space-y-4", isLanding && "space-y-4")}>
          {isLanding ? (
            <div className="v2-input-panel px-5 py-4">
              <label htmlFor="github-url" className="sr-only">
                GitHub 레포지토리 URL
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <SearchIcon className="text-sky-500" />
                  <Input
                    id="github-url"
                    type="url"
                    placeholder="Paste GitHub URL..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="h-11 border-transparent bg-transparent px-0 text-base text-slate-700 placeholder:text-slate-400 shadow-none focus-visible:border-transparent focus-visible:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="v2-button-primary h-11 px-7 text-sm"
                >
                  {isPending ? "분석 중..." : "Analyze"}
                </Button>
              </div>
            </div>
          ) : (
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
          )}
        </TabsContent>
      </Tabs>

      {error && (
        <div
          className={cn(
            "rounded-md p-3 text-sm",
            isLanding
              ? "border border-red-200 bg-red-50 text-red-600"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {error}
        </div>
      )}

      {!isLanding && (
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "분석 중..." : "의존성 분석"}
        </Button>
      )}
    </form>
  );
});

DependencyParserForm.displayName = "DependencyParserForm";
