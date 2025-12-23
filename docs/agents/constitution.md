# Dependenga Constitution

프로젝트의 핵심 원칙과 기술 결정 가이드라인입니다.
모든 개발 결정은 이 문서를 기준으로 합니다.

---

## 프로젝트 미션

> GitHub 프로젝트의 의존성 취약점을 시각적으로 분석하여
> 개발자가 크리티컬한 의존성을 직관적으로 파악할 수 있게 합니다.

---

## 핵심 원칙

### 1. 사용자 경험 우선

- 복잡한 분석 결과를 **직관적인 3D 시각화**로 제공
- 첫 사용 시 10초 내에 핵심 정보 전달
- 기술적 전문 지식 없이도 이해 가능한 UI

### 2. 데이터 정확성

- 의존성 분석은 **실제 lock 파일** 기반
- 취약점 정보는 **공신력 있는 소스** (npm audit, GitHub Advisory)
- 버전 정보 불일치 시 명확히 표시

### 3. 성능 최적화

- 3D 렌더링 60fps 유지
- 초기 로딩 3초 이내
- 대규모 의존성 트리도 부드럽게 처리

---

## 기술 결정 가이드

### 채택

| 기술 | 버전 | 이유 |
| --- | --- | --- |
| Next.js (App Router) | 15 | 풀스택, SSR, React 19 지원 |
| React | 19 | 최신 기능 (Suspense, Server Components) |
| React Three Fiber | 9 | React 19 호환, 3D 렌더링 |
| Prisma | 6 | 타입 안전 ORM, Rust-free Client |
| PostgreSQL | 17 | JSON 지원, 확장성 |
| Tailwind CSS | 4 | 유틸리티 CSS |

### 지양

| 기술 | 이유 |
| --- | --- |
| Three.js 직접 사용 | R3F가 React와 더 잘 통합 |
| MongoDB | 관계형 데이터에 부적합 |
| 클라이언트 전용 분석 | 보안, 캐싱 이슈 |

---

## 코드 품질 기준

- TypeScript strict mode 사용
- ESLint + Prettier 필수
- 주요 비즈니스 로직 테스트 커버리지 80%+
- 컴포넌트는 단일 책임 원칙

---

## 보안 원칙

- GitHub 토큰은 서버 사이드에서만 사용
- 사용자 데이터 최소 수집
- 분석 결과는 사용자별 격리
