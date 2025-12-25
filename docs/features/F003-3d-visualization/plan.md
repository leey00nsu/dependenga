# Implementation Plan: 3D 젠가 시각화

- Feature: F003-3d-visualization
- Status: Approved
- Date: 2025-12-25

## 개요

의존성 분석 결과를 3D 젠가 타워로 시각화. 취약점이 있는 패키지를 색상과 위치로 구분하여 직관적으로 표시.

---

## 기술 스택

| 기술 | 버전 | 역할 |
|------|------|------|
| React Three Fiber | 9.x | 3D 렌더링 |
| @react-three/drei | 10.x | 3D 유틸리티 (OrbitControls, Html, RoundedBox) |
| @lottiefiles/dotlottie-react | 0.17.x | 로딩 애니메이션 |
| Three.js | 0.182.x | 3D 엔진 |

---

## Proposed Changes

### Entities Layer

#### [MODIFY] `src/entities/vulnerability/model/types.ts`
- `SeverityWithSafe` 타입 추가: "critical" | "high" | "medium" | "low" | "safe"

---

### Features Layer

#### [NEW] `src/features/jenga-tower/ui/jenga-block.tsx`
- 개별 젠가 블록 컴포넌트
- 심각도별 색상 매핑 (Critical: 빨강, High: 주황, Medium: 노랑, Low: 초록, Safe: 회색)
- RoundedBox + 나무 텍스처
- 호버 시 하이라이트 효과

#### [NEW] `src/features/jenga-tower/ui/jenga-tower.tsx`
- 젠가 타워 조립 로직
- 층당 3개 블록 (취약 1개 + Safe 2개)
- 심각도별 튀어나옴 오프셋
- 패널 호버 동기화용 highlightedPackage prop

#### [NEW] `src/features/jenga-tower/ui/jenga-scene.tsx`
- 3D 씬 설정 (Canvas, Camera, Lights)
- OrbitControls (패닝, 줌, 회전)
- 타워 높이 기반 동적 카메라 설정

#### [MODIFY] `src/features/vulnerability-analyzer/ui/vulnerability-panel.tsx`
- 심각도별 그룹화 표시
- Safe 패키지 포함
- 마우스 따라다니는 툴팁

---

### Shared Layer

#### [NEW] `src/shared/ui/loading-animation.tsx`
- dotLottie 로딩 애니메이션
- CSS fallback 지원

---

### Views Layer

#### [MODIFY] `src/views/home-view.tsx`
- 3-state UI: Initial → Loading → Result
- 60/40 분할 레이아웃 (3D 씬 | 패널)
- 한 번 클릭 분석 플로우
- 블록/패널 호버 동기화

---

## 아키텍처

```
HomeView
├── Initial State: DependencyParserForm
├── Loading State: LoadingAnimation (dotLottie)
└── Result State
    ├── JengaScene (60%)
    │   └── JengaTower
    │       └── JengaBlock (각 블록)
    └── VulnerabilityPanel (40%)
```

---

## Verification Plan

### Automated Tests
```bash
pnpm test --run
```
- `jenga-block.test.tsx`: 블록 색상 매핑, 호버 이벤트
- `jenga-tower.test.tsx`: 층 계산, 블록 배치 로직

### Browser Test
1. `pnpm dev` 실행
2. http://localhost:3002 접속
3. package.json 입력 (lodash, express 등)
4. "의존성 분석" 클릭
5. 3D 젠가 타워 렌더링 확인
6. 패널 호버 → 블록 하이라이트 확인
7. 블록 호버 → 툴팁 확인

---

## 관련 문서

- [Spec](./spec.md)
- [Tasks](./tasks.md)
