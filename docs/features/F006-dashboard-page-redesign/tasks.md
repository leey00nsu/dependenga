# Tasks: F006 대시보드 페이지 디자인 반영

> 계획이 승인된 후 작성합니다.
> 구체적이고 실행 가능한 작업 단위로 분해합니다.

---

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[REVIEW]` → `[DONE]`
- **우선순위**: P0(긴급) > P1(높음) > P2(보통) > P3(낮음)
- **병렬 실행**: `[P]` 마커로 표시
- **태스크 ID**: `T-F006-{번호}`

---

## 태스크 목록

### Phase 1: 결과 화면 레이아웃 리디자인

- [DONE][P1] T-F006-01 결과 화면 레이아웃 재구성
  - Owner: @me
  - Status Log: 2026-01-07 [TODO] → 2026-01-07 [DOING] → 2026-01-07 [DONE]
  - Acceptance:
    - result state 레이아웃이 `dashboard.png` 기준으로 재배치된다
    - 배경/그리드/톤이 시안과 일치한다
  - Checklist:
    - [x] `HomeView` result 레이아웃 수정
    - [x] 배경/그리드/톤 조정

### Phase 2: 우측 패널/스타일 반영

- [DONE][P1] T-F006-02 취약점 패널 UI 리디자인
  - Owner: @me
  - Status Log: 2026-01-07 [TODO] → 2026-01-07 [DOING] → 2026-01-07 [DONE]
  - Acceptance:
    - 취약점 요약 카드와 패키지 목록이 시안 톤으로 변경된다
    - 배지/프로그레스/상태 색상이 시안과 일치한다
  - Checklist:
    - [x] `VulnerabilityPanel` 스타일 조정
    - [x] 배지/프로그레스 스타일 추가

### Phase 3: 반응형/디테일 폴리시

- [DONE][P2] T-F006-03 반응형 레이아웃 정리
  - Owner: @me
  - Status Log: 2026-01-07 [TODO] → 2026-01-07 [DOING] → 2026-01-07 [DONE]
  - Acceptance:
    - 모바일/태블릿에서 섹션 순서와 간격이 자연스럽다
    - 텍스트/숫자 오버플로가 발생하지 않는다
  - Checklist:
    - [x] 주요 브레이크포인트 레이아웃 점검
    - [x] 텍스트/숫자 표시 정리
    - [x] 시각 비교 및 미세 조정

- [DONE][P2] T-F006-05 로딩 화면 톤 정리
  - Owner: @me
  - Status Log: 2026-01-07 [TODO] → 2026-01-07 [DOING] → 2026-01-07 [DONE]
  - Acceptance:
    - 분석 시작 시 화면 전환에서 밝은 플래시가 발생하지 않는다
    - 로딩 화면이 다크 톤 배경과 텍스트 대비로 표시된다
  - Checklist:
    - [x] `LoadingAnimation` 배경 톤 수정
    - [x] 로딩 텍스트/스피너 색상 정리

### Phase 4: 문서 업데이트

- [DONE][P2] T-F006-04 문서 업데이트
  - Owner: @me
  - Status Log: 2026-01-07 [TODO] → 2026-01-07 [DONE]
  - Acceptance:
    - 변경 사항이 관련 문서에 반영된다
  - Checklist:
    - [x] 필요 시 `decisions.md` 기록
    - [x] `spec.md` 또는 `plan.md` 업데이트 사항 정리

---

## 완료 조건

- [x] 모든 태스크 [DONE]
- [x] 모든 테스트 통과
- [x] 문서 업데이트 완료
- [x] 코드 리뷰 완료
