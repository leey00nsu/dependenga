# Decisions Log

기술 결정과 그 이유를 기록합니다.

> 형식: `D{번호}: {결정 제목} ({YYYY-MM-DD})`

---

## D001: Prisma 의존성 임시 제거 (2026-01-19)

- **Context**: Prisma가 사용되지 않는데 Node 버전 제약으로 배포 실패 발생
- **Options**: Node 24 상향, Prisma 다운그레이드, Prisma 제거 후 필요 시 재추가
- **Decision**: Prisma를 임시 제거하고 필요 시 재추가 가이드를 남긴다
- **Rationale**: 현재 사용되지 않는 의존성을 제거해 리스크를 즉시 낮춤
- **Consequences**: DB 기능 도입 시 재설치/설정 단계가 필요
