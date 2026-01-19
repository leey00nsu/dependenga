# Dependenga

디펜던시 + 젠가 = **Dependenga**

GitHub 프로젝트의 의존성 취약점을 3D 젠가 형태로 시각화하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- GitHub URL 또는 package.json 입력으로 의존성 분석
- 취약점 심각도에 따른 시각적 표시
- 3D 젠가 타워로 의존성 관계 시각화
- 분석 결과 저장 및 이력 관리

## 🛠 기술 스택

| 기술 | 버전 | 용도 |
| --- | --- | --- |
| Next.js | 16 | 풀스택 프레임워크 |
| React | 19 | UI 라이브러리 |
| React Three Fiber | 9 | 3D 렌더링 |
| PostgreSQL | 17 | 데이터베이스 |
| Tailwind CSS | 4 | 스타일링 |
| shadcn/ui | - | UI 컴포넌트 |
| TanStack Query | 5 | 서버 상태 관리 |
| Vitest | 4 | 테스트 |
| Storybook | 10 | 컴포넌트 문서화 |
| Playwright | 1 | E2E 테스트 |

## 📂 프로젝트 구조

```text
dependenga/
├── docs/               # 프로젝트 문서
├── src/
│   ├── app/            # Next.js App Router
│   ├── widgets/        # 독립적인 UI 블록
│   ├── features/       # 비즈니스 기능
│   ├── entities/       # 비즈니스 엔티티
│   └── shared/         # 공유 리소스 (ui, lib, api)
└── .storybook/         # Storybook 설정
```

## 📖 문서

- [PRD](./docs/prd/dependenga-prd.md)
- [에이전트 가이드](./docs/agents/agents.md)
- [Git 워크플로우](./docs/agents/git-workflow.md)

## 🚀 시작하기

```bash
# 의존성 설치
pnpm install

# 데이터베이스 시작 (Prisma 재도입 전까지 DB 스크립트 비활성)
# pnpm db:up

# 개발 서버 실행
pnpm dev

# 테스트 실행
pnpm test

# Storybook 실행
pnpm storybook
```

## 📝 License

MIT
