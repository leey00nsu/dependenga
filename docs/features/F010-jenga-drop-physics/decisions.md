# Decisions Log

기술 결정과 그 이유를 기록합니다.

> 형식: `D{번호}: {결정 제목} ({YYYY-MM-DD})`

---

## D001: 물리 엔진으로 @react-three/rapier 선택 (2026-01-15)

- **Context**: 젠가 블록이 위에서 떨어져 자연스럽게 쌓이는 물리 시뮬레이션 필요
- **Options**: @react-three/rapier, @react-three/cannon, 커스텀 트윈 애니메이션
- **Decision**: @react-three/rapier
- **Rationale**: R3F와 통합이 자연스럽고 성능/안정성이 높으며 유지보수가 활발함
- **Consequences**: `@react-three/rapier` 의존성 추가, Physics 컨텍스트 래핑 필요

## D002: 블록 정착 후 Physics 일시정지 (2026-01-15)

- **Context**: 블록 정착 이후에도 물리 시뮬레이션이 계속되면 성능 비용 발생
- **Options**: 항상 시뮬레이션 유지, 정착 후 Physics `paused`, 정착 후 RigidBody를 fixed로 전환
- **Decision**: 정착 후 Physics `paused`
- **Rationale**: 구현 단순성 유지하면서 불필요한 연산을 줄일 수 있음
- **Consequences**: 정착 상태 감지 로직 필요, 재생성 시 Physics 재시작 필요
