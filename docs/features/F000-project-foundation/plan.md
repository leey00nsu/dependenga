# Implementation Plan: 프로젝트 기반 설정

## 개요

- **기능 ID**: F000
- **스펙 버전**: v1.0
- **작성일**: 2024-12-24
- **상태**: Approved

---

## 기술 스택

| 구분 | 기술 | 버전 |
| --- | --- | --- |
| 아키텍처 | FSD | - |
| UI | shadcn/ui | latest |
| 상태 관리 | TanStack Query | 5 |
| 단위 테스트 | Vitest | latest |
| 컴포넌트 문서 | Storybook | 8+ |
| E2E 테스트 | Playwright | latest |
| DB | PostgreSQL | 17 |
| ORM | Prisma | 7 |
| 컨테이너 | Docker Compose | - |

---

## FSD 폴더 구조

```
src/
├── app/                    # Next.js App Router (기존)
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx       # QueryClientProvider 등
├── widgets/                # 독립적인 UI 블록
├── features/               # 비즈니스 기능
├── entities/               # 비즈니스 엔티티
└── shared/                 # 공유 리소스
    ├── ui/                 # shadcn 컴포넌트
    ├── lib/                # 유틸리티
    ├── api/                # API 클라이언트
    └── config/             # 설정
```

---

## 설치 명령어

### shadcn/ui
```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input card
```

### TanStack Query
```bash
pnpm add @tanstack/react-query
```

### Vitest
```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### Storybook
```bash
pnpm dlx storybook@latest init
```

### Playwright
```bash
pnpm dlx playwright init
```

---

## 설정 파일

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/shared/lib/test-setup.ts',
  },
});
```

### docker-compose.yml
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

### .env.example
```
DATABASE_URL="postgresql://dependenga:dependenga@localhost:5432/dependenga"
```

---

## package.json 스크립트 추가

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "db:up": "docker compose up -d",
    "db:down": "docker compose down",
    "db:push": "prisma db push"
  }
}
```

---

## 검증 계획

| 항목 | 검증 방법 |
| --- | --- |
| 개발 서버 | `pnpm dev` 정상 실행 |
| 단위 테스트 | `pnpm test` 통과 |
| Storybook | `pnpm storybook` 실행 |
| E2E | `pnpm test:e2e` 통과 |
| Docker | `pnpm db:up` 실행 |
| Prisma | `pnpm db:push` 성공 |

---

## 관련 문서

- Spec: [spec.md](./spec.md)
