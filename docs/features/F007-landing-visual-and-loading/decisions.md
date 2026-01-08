# Decisions Log

기술 결정과 그 이유를 기록합니다.

> 형식: `D{번호}: {결정 제목} ({YYYY-MM-DD})`

---

## D001: 큐브 비주얼/로딩을 SVG 기반으로 구현 (2026-01-07)

- **Context**: 랜딩 중앙 비주얼과 로딩 애니메이션을 동일한 모티프로 정리해야 함
- **Options**: 1) SVG 기반 구현 2) Lottie 애셋 교체 3) Three.js/Canvas 렌더링
- **Decision**: `docs/designs/cube.html`을 JSX로 변환한 SVG 기반 구현
- **Rationale**: 가벼운 렌더링 비용, 테마/색상 제어 용이, 외부 에셋 의존 최소화
- **Consequences**: SVG 구조를 컴포넌트로 관리해야 하며, 반응형 스케일링 기준이 필요
