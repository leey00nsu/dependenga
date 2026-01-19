# Decisions Log

기술 결정과 그 이유를 기록합니다.

> 형식: `D{번호}: {결정 제목} ({YYYY-MM-DD})`

---

## D001: 임펄스 벡터를 Rapier Vector 형태로 전달 (2026-01-19)

- **Context**: `applyImpulse`가 Rapier Vector 타입을 요구하는데 배열(tuple)을 전달해 빌드 타입 오류 발생
- **Options**: tuple 유지 후 타입 캐스팅, Rapier Vector 객체로 변환, 래퍼 유틸 도입
- **Decision**: `{ x, y, z }` 형태의 Rapier Vector로 명시적으로 전달
- **Rationale**: 타입 오류를 제거하면서 런타임 동작을 유지하고 변경 범위를 최소화
- **Consequences**: 임펄스/토크 벡터 생성 코드가 객체 형태로 변경됨
