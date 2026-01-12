# Tasks: 랜딩/결과 v2 톤 리디자인

> 계획이 승인된 후 작성합니다.
> 구체적이고 실행 가능한 작업 단위로 분해합니다.

---

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[REVIEW]` → `[DONE]`
- **우선순위**: P0(긴급) > P1(높음) > P2(보통) > P3(낮음)
- **병렬 실행**: `[P]` 마커로 표시
- **태스크 ID**: `T-F009-{태스크번호}`

---

## 태스크 목록

### Phase 1: 랜딩/결과 v2 톤 적용

- [DONE][P1] T-F009-01 v2 배경/전역 스타일 적용
  - Owner: @me
  - Status Log: 2026-01-12 [TODO] → 2026-01-12 [DOING] → 2026-01-12 [DONE]
  - Acceptance:
    - 랜딩/결과 화면에 `background-v2`가 적용된다
    - v2 톤에 필요한 전역 유틸리티가 준비된다
  - Checklist:
    - [x] `public/images`에 v2 이미지 배치
    - [x] `globals.css`에 v2 컬러/유틸리티 추가

- [DONE][P1] T-F009-02 랜딩 화면 레이아웃 리팩토링
  - Owner: @me
  - Status Log: 2026-01-12 [TODO] → 2026-01-12 [DOING] → 2026-01-12 [DONE]
  - Acceptance:
    - 랜딩이 `landing-v2` 톤/구성을 반영한다
    - 메인 로고가 `landing-image`로 노출된다
  - Checklist:
    - [x] `home-view` 레이아웃/배경 교체
    - [x] 로고 이미지 적용

- [DONE][P1] T-F009-03 입력 폼 컴포넌트 v2 스타일 적용
  - Owner: @me
  - Status Log: 2026-01-12 [TODO] → 2026-01-12 [DONE]
  - Acceptance:
    - 업로드/탭/입력/버튼이 component-v2 스타일을 따른다
    - 모바일/데스크톱에서 레이아웃이 유지된다
  - Checklist:
    - [x] 탭/버튼/입력 스타일 업데이트
    - [x] 오류 메시지 v2 톤 적용

- [DONE][P1] T-F009-04 결과 화면 레이아웃 리팩토링
  - Owner: @me
  - Status Log: 2026-01-12 [TODO] → 2026-01-12 [DONE]
  - Acceptance:
    - 결과 화면이 `result-v2` 톤/구성을 반영한다
    - 공유 버튼은 기존 위치(헤더 영역)를 유지한다
  - Checklist:
    - [x] `result-view` 레이아웃/헤더/배경 변경
    - [x] 공유 버튼 위치/스타일 확인

- [DONE][P1] T-F009-05 결과 패널 v2 카드/배지 스타일 적용
  - Owner: @me
  - Status Log: 2026-01-12 [TODO] → 2026-01-12 [DONE]
  - Acceptance:
    - 패널/카드/배지가 component-v2 스타일과 정합된다
  - Checklist:
    - [x] `vulnerability-panel` 카드/배지 스타일 업데이트

- [TODO][P1] T-F009-06 3D 젠가 블럭 v2 컬러 적용
  - Owner: @me
  - Status Log: 2026-01-12 [TODO]
  - Acceptance:
    - 블럭 색상/광택/엣지 톤이 result-v2 디자인과 일치한다
    - 색상은 critical(진한빨강), high(주황), medium(노랑), low(초록), safe(파랑)을 사용한다
  - Checklist:
    - [ ] `jenga-block` 컬러 팔레트 교체
    - [ ] 머티리얼/엣지 강조 튜닝

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
