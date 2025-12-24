# Tasks: 의존성 파서

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[DONE]`
- **태스크 ID**: `T-F001-{번호}`
- **GitHub Issue**: #1

---

## Phase 1: 기본 구조

- [DONE][P1] T-F001-01 엔티티 타입 정의
  - Owner: @agent
  - Checklist:
    - [x] `src/entities/dependency/model/types.ts` 생성
    - [x] Dependency, ParsedPackage 인터페이스 정의

- [DONE][P1] T-F001-02 Zod 스키마 정의
  - Owner: @agent
  - Checklist:
    - [x] `src/features/dependency-parser/model/schemas.ts` 생성
    - [x] packageJsonSchema, githubUrlSchema 정의

## Phase 2: API 구현

- [DONE][P1] T-F001-03 GitHub 파일 fetch 유틸
  - Owner: @agent
  - Checklist:
    - [x] `src/shared/api/fetch-github-file.ts` 생성
    - [x] main → master 폴백 로직

- [DONE][P1] T-F001-04 의존성 파싱 로직
  - Owner: @agent
  - Checklist:
    - [x] `src/features/dependency-parser/lib/parse-dependencies.ts` 생성
    - [x] dependencies + devDependencies 파싱

- [DONE][P1] T-F001-05 Server Action 구현
  - Owner: @agent
  - Checklist:
    - [x] `src/features/dependency-parser/api/parse-package-json.ts` 생성
    - [x] Zod 검증 적용

## Phase 3: UI 구현

- [DONE][P1] T-F001-06 입력 폼 컴포넌트
  - Owner: @agent
  - Checklist:
    - [x] `src/features/dependency-parser/ui/dependency-parser-form.tsx` 생성
    - [x] 탭: 직접 입력 / GitHub URL
    - [x] shadcn Tabs, Textarea, Input, Button 사용

- [DONE][P1] T-F001-07 결과 표시 컴포넌트
  - Owner: @agent
  - Checklist:
    - [x] 파싱 결과 목록 표시
    - [x] dependencies / devDependencies 분리 표시

## Phase 4: 페이지 통합

- [DONE][P1] T-F001-08 메인 페이지 구성
  - Owner: @agent
  - Checklist:
    - [x] `src/views/home-view.tsx` 생성 (FSD views 레이어)
    - [x] `src/app/page.tsx` 수정 (라우팅만 담당)
    - [x] DependencyParserForm 통합

## Phase 5: 테스트

- [DONE][P1] T-F001-09 유닛 테스트
  - Owner: @agent
  - Checklist:
    - [x] parse-dependencies.test.ts
    - [x] fetch-github-file.test.ts

- [DONE][P1] T-F001-10 컴포넌트 테스트
  - Owner: @agent
  - Checklist:
    - [x] 브라우저 통합 테스트로 검증 완료

---

## 완료 조건

- [x] 모든 태스크 [DONE]
- [x] `pnpm dev` 정상 실행
- [x] `pnpm test` 통과
- [x] 직접 입력 및 GitHub URL 모두 동작
