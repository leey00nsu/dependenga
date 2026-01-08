# Implementation Plan: 랜딩 메인 비주얼 및 로딩 애니메이션 정리

> 스펙이 승인된 후 작성합니다.
> 기술적인 "어떻게"를 다룹니다.

---

## 개요

- **기능 ID**: F007
- **스펙 버전**: v1.0
- **작성일**: 2026-01-07
- **상태**: Draft

---

## 기술 스택

| 구분 | 선택 | 이유 |
| --- | --- | --- |
| UI | React + Next.js(App Router) | 기존 랜딩 구성과 동일한 렌더링 흐름 유지 |
| 그래픽 | Inline SVG (cube.html 기반) | 외부 에셋 없이 테마 일관성, 가벼운 렌더링 |
| 스타일 | Tailwind CSS | 기존 스타일 시스템과 일관 유지 |

---

## 아키텍처

- 랜딩 초기 화면 중앙의 플레이스홀더 영역을 SVG 큐브 비주얼 컴포넌트로 대체
- 분석 로딩 화면은 동일한 큐브 모티프 기반 애니메이션으로 갱신
- 상태 흐름은 기존 `HomeView`의 `appState` 전환을 그대로 사용

```
[HomeView 초기 화면] → [LandingCubeVisual]
[Analyze 실행] → [LoadingAnimation (Cube 기반)]
```

---

## 파일 구조

```
src/
├── shared/
│   └── ui/
│       ├── cube-visual.tsx        # cube.html을 JSX로 변환한 비주얼
│       └── loading-animation.tsx  # 로딩 애니메이션 UI (큐브 모티프 사용)
└── views/
    └── home-view.tsx              # 중앙 비주얼 교체
```

---

## 데이터 모델

- 데이터 모델 변경 없음

---

## API 설계

- API 변경 없음

---

## 테스트 전략

- **단위 테스트**: 없음 (UI 정적 컴포넌트)
- **통합 테스트**: 없음
- **E2E 테스트**: 수동 확인 (랜딩/로딩 화면 시각 검증)

---

## 리스크 & 완화

| 리스크 | 완화 방안 |
| --- | --- |
| SVG 렌더링이 레이아웃을 침범 | 컨테이너 크기/overflow 제어 |
| 로딩 애니메이션 과도한 시각 효과 | 글로우/투명도 값 조정 |

---

## 관련 문서

- Spec: [spec.md](./spec.md)
- 디자인: [cube.html](../../designs/cube.html)
