# PRD: Dependenga

## 1. 목표 & 핵심 컨셉

- **목표**: GitHub 프로젝트 또는 package.json을 분석하여 의존성 취약점을 3D 젠가 형태로 시각화
- **핵심 가치**
  - 복잡한 의존성 관계를 직관적인 3D 시각화로 표현
  - 크리티컬한 의존성을 한눈에 파악 가능
  - 취약한 "젠가 블록"을 강조하여 리스크 인지

---

## 2. 대상 사용자 & 시나리오

- **대상**
  - 프로젝트 의존성 관리가 필요한 개발자
  - 보안 취약점을 시각적으로 파악하고 싶은 팀
- **주요 시나리오**
  1. GitHub 레포 URL 또는 package.json 입력
  2. 의존성 트리 분석 및 취약점 정보 수집
  3. 3D 젠가 형태로 시각화 (취약한 블록 강조)
  4. 블록 클릭 시 상세 정보 표시
  5. 분석 결과 저장 및 이력 관리

---

## 3. 범위 (스코프)

### 포함

- GitHub URL 입력 → package.json 자동 추출
- package.json 직접 입력/업로드
- 의존성 트리 파싱 (dependencies, devDependencies)
- 취약점 정보 조회 (npm audit 기반)
- 3D 젠가 시각화 (React Three Fiber)
- 블록별 상세 정보 (버전, 취약점, 의존 관계)
- 분석 결과 DB 저장 (PostgreSQL + Prisma)

### 제외 (향후)

- Private 레포 지원 (GitHub OAuth 필요)
- 실시간 알림/모니터링
- 다른 패키지 매니저 (yarn.lock, pnpm-lock.yaml)
- 팀 협업 기능
- 리포트 내보내기 (PDF)

---

## 4. 기능 요구사항 (FRD)

### 4.1 입력 처리

- GitHub URL 입력 시 raw.githubusercontent.com에서 package.json 가져오기
- package.json 텍스트 직접 붙여넣기 지원
- 파일 업로드 지원

### 4.2 의존성 분석

- 직접 의존성 추출 (dependencies, devDependencies)
- 각 패키지의 버전 정보 파싱
- npm registry API로 최신 버전 비교

### 4.3 취약점 분석

- npm audit 스타일 취약점 정보 조회
- 심각도 분류: critical, high, medium, low
- 영향받는 버전 범위 표시

### 4.4 3D 시각화

- 젠가 타워 형태로 의존성 표시
- 블록 크기: 의존하는 패키지 수 기반
- 블록 색상: 취약점 심각도 기반
  - 빨강: critical
  - 주황: high
  - 노랑: medium
  - 초록: safe
- 블록 위치: 의존성 깊이 기반 (하단 = 많이 의존됨)
- 호버 시 정보 표시
- 클릭 시 상세 패널

### 4.5 데이터 저장

- 분석 결과 PostgreSQL 저장
- 동일 프로젝트 재분석 시 변경점 비교
- 분석 이력 조회

---

## 5. 기술 스택

| 구분 | 기술 | 설명 |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | 풀스택 프레임워크, React 19 지원 |
| 3D | React Three Fiber 9 + Drei | React 19 호환 3D 렌더링 |
| DB | PostgreSQL 17 | 관계형 데이터 저장 |
| ORM | Prisma 7 | 타입 안전 ORM |
| Styling | Tailwind CSS 4 | 유틸리티 CSS |
| Validation | Zod | 스키마 검증 |

---

## 6. 마일스톤 개요

| ID | 이름 | 설명 |
| --- | --- | --- |
| M0 | 프로젝트 초기화 | Next.js + R3F + Prisma 설정 |
| M1 | 입력 & 파싱 | package.json 입력 및 파싱 |
| M2 | 취약점 분석 | npm audit 기반 취약점 조회 |
| M3 | 3D 시각화 | 젠가 타워 렌더링 |
| M4 | 데이터 저장 | 분석 결과 DB 저장 |
| M5 | UI 완성 | 상세 패널, 이력 조회 |
