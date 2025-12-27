# Tasks: 문서 구조 개선 (ADR 도입)

- Feature: F004-documentation-improvement
- Issue: #9

---

## Phase 1: docs/agents 업데이트

- [DONE][P1] T-F004-01 ADR 규칙 추가
  - Owner: @agent
  - Checklist:
    - [x] `agents.md`에 ADR 규칙 섹션 추가
    - [x] `decisions.md` 필수 기록으로 변경

---

## Phase 2: feature-base 템플릿 업데이트

- [DONE][P1] T-F004-02 템플릿 파일 정리
  - Owner: @agent
  - Checklist:
    - [x] `feature-base/decisions.md` 템플릿 생성
    - [x] `feature-base/research.md` 삭제

---

## Phase 3: 기존 Feature 마이그레이션

- [DONE][P2] T-F004-03 research.md 삭제
  - Owner: @agent
  - Checklist:
    - [x] F001 `research.md` 삭제
    - [x] F002 `research.md` 삭제
    - [x] F003 `research.md` 삭제

---

## Phase 4: docs 구조 정리

- [DONE][P2] T-F004-04 docs/db 삭제 및 표준 구조 확립
  - Owner: @agent
  - Checklist:
    - [x] `docs/db` 폴더 삭제
    - [x] `agents.md`에 docs 표준 구조 섹션 추가
    - [x] DB/API 설계는 Feature에 포함됨을 명시

---

## 완료 조건

- [x] `agents.md` ADR 규칙 존재
- [x] `feature-base/decisions.md` 템플릿 존재
- [x] `research.md` 파일들 삭제됨
- [x] `docs/db` 폴더 삭제됨
- [x] docs 표준 구조 문서화됨
