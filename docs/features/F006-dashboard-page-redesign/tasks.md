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

### Phase 1: 라우트/레이아웃 구성

- [TODO][P1] T-F006-01 대시보드 라우트 및 뷰 구성
  - Owner: @me
  - Status Log: 2026-01-07 [TODO]
  - Acceptance:
    - `/dashboard` 라우트가 추가되고 대시보드 뷰가 렌더링된다
    - 시안 기준 레이아웃/그리드 구조가 구성된다
  - Checklist:
    - [ ] `app/dashboard/page.tsx` 추가
    - [ ] `views/dashboard-view.tsx` 생성 및 연결
    - [ ] 기본 레이아웃/그리드 구성

### Phase 2: 섹션/스타일 반영

- [TODO][P1] T-F006-02 대시보드 섹션 컴포넌트 구성
  - Owner: @me
  - Status Log: 2026-01-07 [TODO]
  - Acceptance:
    - 카드/리스트/차트 등 주요 섹션이 시안 구조로 구성된다
    - 공통 UI 컴포넌트가 일관되게 적용된다
  - Checklist:
    - [ ] KPI/요약 카드 구성
    - [ ] 리스트/테이블 섹션 구성
    - [ ] 차트/그래프 영역 플레이스홀더 구성

- [TODO][P1] T-F006-03 디자인 스타일 적용
  - Owner: @me
  - Status Log: 2026-01-07 [TODO]
  - Acceptance:
    - 색상/타이포/카드/배지 스타일이 `dashboard.png`와 일치한다
    - 배경/구분선/여백이 시안 톤과 맞는다
  - Checklist:
    - [ ] 컬러/타이포 스케일 조정
    - [ ] 카드/버튼/배지 스타일 반영
    - [ ] 섹션 간 여백/구분선 정리

### Phase 3: 반응형/디테일 폴리시

- [TODO][P2] T-F006-04 반응형 레이아웃 정리
  - Owner: @me
  - Status Log: 2026-01-07 [TODO]
  - Acceptance:
    - 모바일/태블릿에서 섹션 순서와 간격이 자연스럽다
    - 텍스트/숫자 오버플로가 발생하지 않는다
  - Checklist:
    - [ ] 주요 브레이크포인트 레이아웃 점검
    - [ ] 텍스트/숫자 표시 정리
    - [ ] 시각 비교 및 미세 조정

### Phase 4: 문서 업데이트

- [TODO][P2] T-F006-05 문서 업데이트
  - Owner: @me
  - Status Log: 2026-01-07 [TODO]
  - Acceptance:
    - 변경 사항이 관련 문서에 반영된다
  - Checklist:
    - [ ] 필요 시 `decisions.md` 기록
    - [ ] `spec.md` 또는 `plan.md` 업데이트 사항 정리

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
