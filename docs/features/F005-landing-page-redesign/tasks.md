# Tasks: F005 랜딩페이지 디자인 반영

> 계획이 승인된 후 작성합니다.
> 구체적이고 실행 가능한 작업 단위로 분해합니다.

---

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[REVIEW]` → `[DONE]`
- **우선순위**: P0(긴급) > P1(높음) > P2(보통) > P3(낮음)
- **병렬 실행**: `[P]` 마커로 표시
- **태스크 ID**: `T-F005-{번호}`

---

## 태스크 목록

### Phase 1: 랜딩 레이아웃/비주얼

- [TODO][P1] T-F005-01 랜딩 레이아웃 재구성
  - Owner: @me
  - Status Log: 2026-01-06 [TODO]
  - Acceptance:
    - initial state에서 로고/중앙 비주얼/입력 구성으로 재배치된다
    - 다크 배경 + 그리드 + 중앙 글로우가 적용된다
    - 로그인 버튼은 렌더링되지 않는다
  - Checklist:
    - [ ] `HomeView` initial state 레이아웃 수정
    - [ ] 배경/그리드/글로우 스타일 유틸리티 적용
    - [ ] 중앙 3D 영역 플레이스홀더 구성

### Phase 2: 입력 폼/반응형 폴리시

- [TODO][P1] T-F005-02 입력 폼 디자인 시안 반영
  - Owner: @me
  - Status Log: 2026-01-06 [TODO]
  - Acceptance:
    - `DependencyParserForm`의 탭 UI가 유지된다
    - 입력 필드/버튼 스타일이 landing.png 톤과 일치한다
    - 폼 기능(직접 입력/URL 분석)이 정상 동작한다
  - Checklist:
    - [ ] 랜딩 전용 스타일 옵션(variant/props) 추가
    - [ ] 입력/버튼/탭 스타일 조정
    - [ ] focus/hover/disabled 상태 정리

- [TODO][P2] T-F005-03 반응형/디테일 폴리시
  - Owner: @me
  - Status Log: 2026-01-06 [TODO]
  - Acceptance:
    - 모바일에서 섹션 순서와 간격이 자연스럽다
    - 텍스트/버튼이 읽기 쉽고 터치 영역이 충분하다
    - 시안 대비 과도한 오차가 없다
  - Checklist:
    - [ ] 주요 브레이크포인트 레이아웃 점검
    - [ ] 폰트 크기/간격/버튼 높이 조정
    - [ ] 시각 비교 및 미세 조정

### Phase 3: 문서 정리

- [TODO][P2] T-F005-04 문서 업데이트
  - Owner: @me
  - Status Log: 2026-01-06 [TODO]
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
