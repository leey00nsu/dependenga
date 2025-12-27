# Decisions Log

기술 결정과 그 이유를 기록합니다.

---

## D001: research.md → decisions.md 전환 (2025-12-26)

- **Context**: 에이전트가 개발 중 기술 결정을 내리지만, 그 이유가 문서화되지 않아 추적이 어려움
- **Options**: 
  1. `research.md` 유지 (기존)
  2. `decisions.md`로 전환 (ADR 스타일)
  3. 코드 주석에만 기록
- **Decision**: `decisions.md`로 전환 (ADR 스타일)
- **Rationale**: 
  - ADR은 구조화되어 검색 용이
  - 결정 시점, 배경, 대안 명확히 기록
  - 코드 리뷰 피드백도 결정으로 추적 가능
- **Consequences**: 
  - 기존 `research.md` 삭제
  - 에이전트가 기술 선택 시 즉시 `decisions.md`에 기록
