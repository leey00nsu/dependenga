# Tasks: 프로젝트 기반 설정

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[DONE]`
- **태스크 ID**: `T-F000-{번호}`
- **GitHub Issue**: #2

---

## Phase 1: 폴더 구조 및 기본 설정

- [TODO][P1] T-F000-01 FSD 폴더 구조 생성
  - Owner: @agent
  - Checklist:
    - [ ] `src/widgets/` 생성
    - [ ] `src/features/` 생성
    - [ ] `src/entities/` 생성
    - [ ] `src/shared/{ui,lib,api,config}/` 생성

- [TODO][P1] T-F000-02 Docker Compose + PostgreSQL 설정
  - Owner: @agent
  - Checklist:
    - [ ] `docker-compose.yml` 생성
    - [ ] `.env.example` 생성
    - [ ] `.env` 업데이트
    - [ ] `docker compose up -d` 확인

- [TODO][P1] T-F000-03 Prisma 기본 설정
  - Owner: @agent
  - Checklist:
    - [ ] `prisma/schema.prisma` 업데이트
    - [ ] `pnpm prisma db push` 확인

## Phase 2: UI 및 상태 관리

- [TODO][P1] T-F000-04 shadcn/ui 설치
  - Owner: @agent
  - Checklist:
    - [ ] `shadcn init` 실행
    - [ ] Button, Input, Card 컴포넌트 추가
    - [ ] 경로 `src/shared/ui/` 확인

- [TODO][P1] T-F000-05 TanStack Query 설정
  - Owner: @agent
  - Checklist:
    - [ ] `@tanstack/react-query` 설치
    - [ ] `providers.tsx` 생성
    - [ ] `layout.tsx`에 Provider 적용

## Phase 3: 테스트 환경

- [TODO][P1] T-F000-06 Vitest 설정
  - Owner: @agent
  - Checklist:
    - [ ] Vitest 및 관련 패키지 설치
    - [ ] `vitest.config.ts` 생성
    - [ ] 샘플 테스트 작성 및 통과

- [TODO][P1] T-F000-07 Storybook 설정
  - Owner: @agent
  - Checklist:
    - [ ] Storybook 초기화
    - [ ] Tailwind CSS 통합
    - [ ] Button 스토리 작성

- [TODO][P1] T-F000-08 Playwright 설정
  - Owner: @agent
  - Checklist:
    - [ ] Playwright 초기화
    - [ ] 기본 E2E 테스트 작성 및 통과

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] `pnpm dev` 정상 실행
- [ ] `pnpm test` 통과
- [ ] `pnpm storybook` 실행 가능
- [ ] `pnpm test:e2e` 통과
- [ ] `docker compose up -d` 정상 실행
