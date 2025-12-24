# Feature Spec: 프로젝트 기반 설정

## 개요

- **기능 ID**: F000
- **기능명**: project-foundation
- **작성일**: 2024-12-24
- **상태**: Draft
- **GitHub Issue**: [#2](https://github.com/leey00nsu/dependenga/issues/2)

---

## 목적

프로젝트의 아키텍처, UI 라이브러리, 상태 관리, 테스트 환경을 설정하여 이후 기능 개발의 기반을 마련합니다.

---

## 설정 항목

### 1. FSD (Feature-Sliced Design) 패턴

**목표**: 확장 가능한 폴더 구조 적용

**구조**:
```
src/
├── app/              # Next.js App Router
├── pages/            # (App Router에서는 미사용)
├── widgets/          # 독립적인 UI 블록
├── features/         # 비즈니스 기능
├── entities/         # 비즈니스 엔티티
├── shared/           # 공유 유틸리티, UI 컴포넌트
│   ├── ui/           # shadcn 컴포넌트
│   ├── lib/          # 유틸리티
│   ├── api/          # API 클라이언트
│   └── config/       # 설정
└── (pages layer는 App Router로 대체)
```

**규칙**:
- ❌ 배럴 파일 (index.ts) 사용 금지
- ✅ 직접 경로로 import

### 2. shadcn/ui

**목표**: 일관된 UI 컴포넌트 시스템

**설정**:
- `components.json` 설정
- 경로: `src/shared/ui/`
- 기본 컴포넌트: Button, Input, Card

### 3. TanStack Query

**목표**: 서버 상태 관리

**설정**:
- QueryClientProvider 설정
- 기본 QueryClient 옵션

### 4. Vitest

**목표**: 단위/통합 테스트

**설정**:
- vitest.config.ts
- React Testing Library 통합
- 커버리지 리포트

### 5. Storybook

**목표**: 컴포넌트 문서화 및 시각적 테스트

**설정**:
- Storybook 8+
- Tailwind CSS 통합
- shadcn 컴포넌트 스토리

### 6. Playwright

**목표**: E2E 테스트

**설정**:
- playwright.config.ts
- 기본 E2E 테스트 (홈페이지 로드)

### 7. Docker Compose + PostgreSQL

**목표**: 로컬 개발 환경 데이터베이스

**설정**:
- `docker-compose.yml` 생성
- PostgreSQL 17 컨테이너
- Volume 영속화
- `.env.example` 제공

**docker-compose.yml**:
```yaml
services:
  db:
    image: postgres:17
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: dependenga
      POSTGRES_PASSWORD: dependenga
      POSTGRES_DB: dependenga
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 8. Prisma 기본 설정

**목표**: ORM 설정 및 DB 연결 확인

**설정**:
- `prisma/schema.prisma` 업데이트
- DATABASE_URL 환경 변수 설정
- `pnpm prisma db push` 테스트

---

## 비기능 요구사항

- 모든 설정 후 `pnpm dev` 정상 실행
- `pnpm test` (Vitest) 통과
- `pnpm storybook` 실행 가능
- `pnpm test:e2e` (Playwright) 통과
- `docker compose up -d` 정상 실행
- `pnpm prisma db push` 성공

---

## 스펙 외 (Out of Scope)

- 실제 기능 구현 (F001에서 진행)
- 상세 컴포넌트 제작
- CI/CD 설정

---

## 관련 문서

- PRD: [dependenga-prd.md](../../prd/dependenga-prd.md)
- Constitution: [constitution.md](../../agents/constitution.md)
