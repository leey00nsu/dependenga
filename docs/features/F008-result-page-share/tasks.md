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

- [DONE][P1] T-F008-02 FSD 뷰 분리
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - `views`가 `widgets` 구조로 이동된다
    - 페이지에서 새 경로를 사용한다
  - Checklist:
    - [x] `views/home-view.tsx` 이동
    - [x] 신규 `widgets/result` 생성
    - [x] import 경로 정리

### Phase 2: 공유 URL 인코딩/디코딩

- [DONE][P1] T-F008-03 쿼리스트링 인코딩/디코딩 유틸
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - 의존성 목록이 lz-string으로 압축된다
    - 디코딩 실패 시 오류를 반환한다
  - Checklist:
    - [x] `share-query` 유틸 추가
    - [x] 정상/오류 케이스 테스트

- [DONE][P1] T-F008-04 URL 길이 경고 처리
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - 4000자 초과 시 경고가 표시된다
    - 사용자가 진행 여부를 선택할 수 있다
  - Checklist:
    - [x] 길이 계산 로직 추가
    - [x] 경고 UI 추가

### Phase 3: 결과 화면 복원 & 공유

- [DONE][P1] T-F008-05 결과 화면 복원/분석 흐름
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - `/result`에서 쿼리 데이터를 복원해 분석을 실행한다
    - 복원 실패 시 오류 안내가 표시된다
  - Checklist:
    - [x] 복원 로직 연결
    - [x] 오류 화면/복귀 액션 추가

- [DONE][P2] T-F008-06 결과 URL 복사 UI
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - 결과 URL을 복사할 수 있다
  - Checklist:
    - [x] 복사 버튼 추가
    - [x] 복사 성공/실패 피드백

### Phase 4: 공유 UX 개선

- [DONE][P1] T-F008-07 복사 토스트 개선 (sonner)
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - 복사 클릭 시 sonner 토스트가 표시된다
    - 토스트 스타일이 테마와 조화를 이룬다
  - Checklist:
    - [x] sonner 토스트 연결
    - [x] 테마 스타일 조정

- [DONE][P2] T-F008-08 로고 클릭 홈 이동
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - Dependenga 로고 클릭 시 `/`로 이동한다
  - Checklist:
    - [x] 로고 링크 처리

- [DONE][P1] T-F008-09 뒤로가기 히스토리 보장
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - `/` → `/result` 이동 후 브라우저 뒤로가기 시 `/`로 복귀한다
  - Checklist:
    - [x] 라우팅 히스토리 동작 점검/수정

...

### Phase 5: FSD 분리 분석

- [DONE][P2] T-F008-10 위젯 책임 분리 분석
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - 현재 widget 역할 과다 여부를 진단한다
    - FSD 레이어별 분리 가능 지점을 정리한다
  - Checklist:
    - [x] 분리 후보/근거 정리
    - [x] 최소 변경 경로 제안

### Phase 6: FSD 분리 적용

- [DONE][P1] T-F008-11 위젯 책임 분리 적용
  - Owner: @me
  - Status Log: 2026-01-08 [TODO] → 2026-01-08 [DOING] → 2026-01-08 [DONE]
  - Acceptance:
    - 공유 URL 로직이 feature 레이어로 이동한다
    - 분석 실행 로직이 model 레이어로 분리된다
    - widgets는 조합/렌더 역할에 집중한다
  - Checklist:
    - [x] 공유 URL 유틸/버튼 분리
    - [x] 분석 hook 분리
    - [x] widgets에서 직접 로직 제거

---

## 완료 조건

- [x] 모든 태스크 [DONE]
- [x] 모든 테스트 통과
- [x] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
