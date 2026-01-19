# Tasks: Coolify 배포 pnpm 워크스페이스 설정 보정

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

### Phase 1: 워크스페이스 설정 보정

- [DONE][P1] T-F013-01 pnpm workspace 설정 수정
  - Owner: @me
  - Status Log: 2026-01-19 [TODO] → 2026-01-19 [DOING] → 2026-01-19 [DONE]
  - Acceptance:
    - `pnpm install`이 `packages field missing or empty`로 실패하지 않는다
    - 로컬 개발 워크플로우는 동일하게 유지된다
  - Checklist:
    - [x] pnpm-workspace.yaml에 packages 추가
    - [x] 로컬 pnpm install 동작 확인

### Phase 2: 검증

- [TODO][P2] T-F013-02 배포/빌드 재검증
  - Owner: @me
  - Status Log: 2026-01-19 [TODO]
  - Acceptance:
    - Coolify 배포에서 설치 단계가 실패하지 않는다
  - Checklist:
    - [ ] Coolify 재배포 로그 확인

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
