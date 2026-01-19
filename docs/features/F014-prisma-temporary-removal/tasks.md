# Tasks: Prisma 임시 제거

> 계획이 승인된 후 작성합니다.
> 구체적이고 실행 가능한 작업 단위로 분해합니다.

---

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[REVIEW]` → `[DONE]`
- **우선순위**: P0(긴급) > P1(높음) > P2(보통) > P3(낮음)
- **병렬 실행**: `[P]` 마커로 표시
- **태스크 ID**: `T-F{기능번호}-{태스크번호}`

---

## 태스크 목록

### Phase 1: Prisma 제거

- [DONE][P1] T-F014-01 Prisma 의존성/스크립트 제거
  - Owner: @me
  - Status Log: 2026-01-19 [TODO] → 2026-01-19 [DOING] → 2026-01-19 [DONE]
  - Acceptance:
    - package.json에서 Prisma 관련 의존성이 제거된다
    - prisma 관련 스크립트가 제거된다
  - Checklist:
    - [x] package.json 의존성 제거
    - [x] prisma 스크립트 제거
    - [x] prisma 폴더 제거

### Phase 2: 문서/가이드 정리

- [TODO][P1] T-F014-02 문서 정리 및 재추가 가이드 작성
  - Owner: @me
  - Status Log: 2026-01-19 [TODO]
  - Acceptance:
    - 문서에서 Prisma 언급이 현재 상태와 일치한다
    - Prisma 재추가 가이드가 제공된다
  - Checklist:
    - [ ] PRD/README/헌장 등 Prisma 언급 정리
    - [ ] 재추가 가이드 문서화

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
