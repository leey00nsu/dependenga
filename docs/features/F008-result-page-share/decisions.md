# Decisions Log

기술 결정과 그 이유를 기록합니다.

> 형식: `D{번호}: {결정 제목} ({YYYY-MM-DD})`

---

## D001: 공유 데이터는 URL 쿼리스트링에 압축 저장 (2026-01-08)

- **Context**: 서버 저장 없이 결과를 공유할 수 있어야 함
- **Options**: 1) 서버 저장(토큰) 2) 원문 JSON URL 포함 3) `lz-string` 압축
- **Decision**: `lz-string`으로 의존성 목록만 압축해 URL 쿼리스트링에 포함
- **Rationale**: 구현 단순, 외부 저장 없이 공유 가능, URL 안전 인코딩 지원
- **Consequences**: URL 길이 제한 리스크가 있어 경고 로직 필요
