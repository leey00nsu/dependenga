# Decisions Log

기술 결정과 그 이유를 기록합니다.

> 형식: `D{번호}: {결정 제목} ({YYYY-MM-DD})`

---

## D001: pnpm-workspace.yaml에 단일 패키지 경로 추가 (2026-01-19)

- **Context**: Coolify 배포 환경에서 `pnpm install`이 `packages field missing or empty`로 실패
- **Options**: workspace 제거, npm/yarn 전환, `packages: ['.']` 추가
- **Decision**: `packages: ['.']`를 추가하여 단일 패키지 워크스페이스로 고정
- **Rationale**: 최소 변경으로 배포 실패를 해결하고 로컬 워크플로우를 유지
- **Consequences**: 향후 멀티 패키지 확장 시 목록 업데이트 필요
