# Implementation Plan: 의존성 파서

## 개요

- **기능 ID**: F001
- **스펙 버전**: v1.0
- **작성일**: 2025-12-24
- **상태**: Approved

---

## 기술 스택

| 구분 | 기술 | 용도 |
| --- | --- | --- |
| API | Next.js Server Actions | 서버 사이드 처리 |
| 검증 | Zod | 입력 스키마 검증 |
| HTTP | fetch | GitHub raw URL 요청 |
| 상태 | TanStack Query | 서버 상태 관리 |
| UI | shadcn/ui | 입력 폼, 탭 |

---

## FSD 구조

```text
src/
├── features/
│   └── dependency-parser/
│       ├── ui/
│       │   └── DependencyParserForm.tsx
│       ├── model/
│       │   ├── types.ts
│       │   └── schemas.ts
│       ├── api/
│       │   └── parsePackageJson.ts
│       └── lib/
│           ├── parseGithubUrl.ts
│           └── parseDependencies.ts
├── entities/
│   └── dependency/
│       └── model/
│           └── types.ts
└── shared/
    └── api/
        └── fetchGithubFile.ts
```

---

## 주요 파일

### 1. entities/dependency/model/types.ts

```typescript
export interface Dependency {
  name: string;
  version: string;
  isDev: boolean;
}

export interface ParsedPackage {
  name: string;
  version: string;
  dependencies: Dependency[];
}
```

### 2. features/dependency-parser/model/schemas.ts

```typescript
import { z } from "zod";

export const packageJsonSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
});

export const githubUrlSchema = z.string().regex(
  /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/,
  "유효한 GitHub URL을 입력하세요"
);
```

### 3. shared/api/fetchGithubFile.ts

```typescript
export async function fetchGithubFile(
  owner: string,
  repo: string,
  path: string,
  branch = "main"
): Promise<string> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  const res = await fetch(url);
  
  if (!res.ok) {
    if (branch === "main") {
      return fetchGithubFile(owner, repo, path, "master");
    }
    throw new Error("파일을 찾을 수 없습니다");
  }
  
  return res.text();
}
```

---

## API 설계

### Server Action: parsePackageJson

**경로**: `src/features/dependency-parser/api/parsePackageJson.ts`

```typescript
"use server";

import { packageJsonSchema } from "../model/schemas";
import type { ParsedPackage } from "@/entities/dependency/model/types";

export async function parsePackageJson(
  input: string
): Promise<ParsedPackage> {
  const json = JSON.parse(input);
  const validated = packageJsonSchema.parse(json);
  
  const dependencies = [
    ...Object.entries(validated.dependencies ?? {}).map(([name, version]) => ({
      name,
      version,
      isDev: false,
    })),
    ...Object.entries(validated.devDependencies ?? {}).map(([name, version]) => ({
      name,
      version,
      isDev: true,
    })),
  ];

  return {
    name: validated.name ?? "unknown",
    version: validated.version ?? "0.0.0",
    dependencies,
  };
}
```

---

## UI 컴포넌트

### DependencyParserForm

- 탭: `직접 입력` / `GitHub URL`
- 입력: Textarea (직접 입력) / Input (URL)
- 버튼: `분석하기`
- 결과: 파싱된 의존성 목록 표시

---

## 검증 계획

| 항목 | 방법 |
| --- | --- |
| 유닛 테스트 | `parseDependencies.test.ts` |
| 컴포넌트 테스트 | `DependencyParserForm.test.tsx` |
| E2E | Playwright로 폼 테스트 |

---

## 관련 문서

- Spec: [spec.md](./spec.md)
