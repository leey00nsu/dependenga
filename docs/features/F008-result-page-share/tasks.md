# Tasks: F008 결과 페이지 분리 및 공유 가능한 URL

> 계획이 승인된 후 작성합니다.
> 구체적이고 실행 가능한 작업 단위로 분해합니다.

---

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[REVIEW]` → `[DONE]`
- **우선순위**: P0(긴급) > P1(높음) > P2(보통) > P3(낮음)
- **병렬 실행**: `[P]` 마커로 표시
- **태스크 ID**: `T-F008-{태스크번호}`

---

## 태스크 목록

### Phase 1: 라우팅 분리 & FSD 구조 정리

- [DONE][P1] T-F008-01 라우팅 분리 및 결과 페이지 생성
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - `/`는 입력 화면만 렌더한다
    - `/result`는 결과 화면을 렌더한다
  - Checklist:
    - [x] `/result` 라우트 생성
    - [x] 기존 결과 렌더 분리

- [TODO][P1] T-F008-02 FSD 뷰 분리
  - Owner: @me
  - Status Log: 2026-01-08 [TODO]
  - Acceptance:
    - `views`가 `widgets` 구조로 이동된다
    - 페이지에서 새 경로를 사용한다
  - Checklist:
    - [ ] `views/home-view.tsx` 이동
    - [ ] 신규 `widgets/result` 생성
    - [ ] import 경로 정리

### Phase 2: 공유 URL 인코딩/디코딩

- [TODO][P1] T-F008-03 쿼리스트링 인코딩/디코딩 유틸
  - Owner: @me
  - Status Log: 2026-01-08 [TODO]
  - Acceptance:
    - 의존성 목록이 lz-string으로 압축된다
    - 디코딩 실패 시 오류를 반환한다
  - Checklist:
    - [ ] `share-query` 유틸 추가
    - [ ] 정상/오류 케이스 테스트

- [TODO][P1] T-F008-04 URL 길이 경고 처리
  - Owner: @me
  - Status Log: 2026-01-08 [TODO]
  - Acceptance:
    - 4000자 초과 시 경고가 표시된다
    - 사용자가 진행 여부를 선택할 수 있다
  - Checklist:
    - [ ] 길이 계산 로직 추가
    - [ ] 경고 UI 추가

### Phase 3: 결과 화면 복원 & 공유

- [TODO][P1] T-F008-05 결과 화면 복원/분석 흐름
  - Owner: @me
  - Status Log: 2026-01-08 [TODO]
  - Acceptance:
    - `/result`에서 쿼리 데이터를 복원해 분석을 실행한다
    - 복원 실패 시 오류 안내가 표시된다
  - Checklist:
    - [ ] 복원 로직 연결
    - [ ] 오류 화면/복귀 액션 추가

- [TODO][P2] T-F008-06 결과 URL 복사 UI
  - Owner: @me
  - Status Log: 2026-01-08 [TODO]
  - Acceptance:
    - 결과 URL을 복사할 수 있다
  - Checklist:
    - [ ] 복사 버튼 추가
    - [ ] 복사 성공/실패 피드백

...

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
