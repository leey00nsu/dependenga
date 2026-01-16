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

## D003: 취약점 붕괴 연출은 임펄스 기반으로 구현 (2026-01-15)

- **Context**: 취약점 존재 시 극적인 붕괴 연출 필요
- **Options**: 불안정 파라미터 + 임펄스, 고정된 제거 애니메이션, 수동 트리거
- **Decision**: 취약 블록에 낮은 마찰/댐핑을 적용하고 임펄스/토크로 붕괴 유도
- **Rationale**: 구현 단순성, 물리 기반 자연스러운 붕괴 표현
- **Consequences**: 임펄스 강도 튜닝 필요, 과도한 붕괴 위험

## D004: 붕괴 이후 최종 정착 시 Physics 일시정지 (2026-01-15)

- **Context**: 붕괴 연출 이후에도 지속 시뮬레이션은 불필요한 비용 발생
- **Options**: 1차 정착 후 pause, 붕괴 후 pause, 항상 유지
- **Decision**: 붕괴 이후 2차 정착 시 pause
- **Rationale**: 연출을 살리면서 성능을 확보
- **Consequences**: 정착 상태를 두 번 감지해야 함

## D005: OSV 심각도는 database_specific.severity로 보강 (2026-01-15)

- **Context**: OSV 응답의 CVSS 점수가 벡터 문자열로 제공되는 경우 파싱 실패로 `medium`으로만 분류됨
- **Options**: CVSS 벡터 파서 도입, database_specific.severity 활용, 기본값 유지
- **Decision**: database_specific.severity를 fallback으로 사용해 심각도 분류를 보강
- **Rationale**: 추가 의존성 없이도 분류 정확도를 올리고 샘플 분포를 확보할 수 있음
- **Consequences**: database_specific가 없는 경우는 기존과 동일하게 기본값(`medium`) 적용

## D006: 레이아웃 키 안정화를 위해 패키지 정렬 적용 (2026-01-16)

- **Context**: 입력 패키지 순서에 따라 레이아웃 키가 달라져 불필요한 재빌드가 발생
- **Options**: 입력 순서 유지, 패키지 정렬 후 키 생성, 키 생성 로직 캐시
- **Decision**: 패키지 목록을 정렬한 뒤 레이아웃 키/그룹 분리에 사용
- **Rationale**: 동일 집합의 입력은 동일한 키로 수렴시켜 불필요한 재스폰을 방지
- **Consequences**: 입력 순서 기반 배치에 대한 의존성이 제거됨
