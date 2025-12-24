# Tasks: 3D 젠가 시각화

## 태스크 규칙

- **상태**: `[TODO]` → `[DOING]` → `[DONE]`
- **태스크 ID**: `T-F003-{번호}`
- **GitHub Issue**: #7

---

## Phase 1: 환경 설정

- [DONE][P1] T-F003-01 React Three Fiber 설치
  - Owner: @agent
  - Checklist:
    - [x] @react-three/fiber 설치 (이미 설치됨)
    - [x] @react-three/drei 설치 (이미 설치됨)
    - [x] 타입 정의 확인

## Phase 2: 기본 3D 컴포넌트

- [DONE][P1] T-F003-02 3D Scene 컴포넌트
  - Owner: @agent
  - Checklist:
    - [x] `src/features/jenga-tower/ui/jenga-scene.tsx` 생성
    - [x] Canvas, OrbitControls, Lighting 설정

- [DONE][P1] T-F003-03 젠가 블록 컴포넌트
  - Owner: @agent
  - Checklist:
    - [x] `src/features/jenga-tower/ui/jenga-block.tsx` 생성
    - [x] 심각도별 색상 매핑
    - [x] 호버/클릭 이벤트

## Phase 3: 타워 조립

- [DONE][P1] T-F003-04 젠가 타워 컴포넌트
  - Owner: @agent
  - Checklist:
    - [x] `src/features/jenga-tower/ui/jenga-tower.tsx` 생성
    - [x] 패키지 목록 → 블록 배치 로직
    - [x] 층별 3개, 90도 회전

## Phase 4: UI 연동

- [DONE][P1] T-F003-05 툴팁 컴포넌트
  - Owner: @agent
  - Checklist:
    - [x] Html 컴포넌트로 3D 공간에 툴팁 표시
    - [x] 패키지명, 버전, 취약점 수 표시

- [DONE][P1] T-F003-06 홈 뷰 통합
  - Owner: @agent
  - Checklist:
    - [x] `src/views/home-view.tsx` 수정
    - [x] 3D 시각화 버튼 추가
    - [x] 젠가 타워 표시/숨기기

## Phase 5: 테스트

- [DONE][P1] T-F003-07 브라우저 테스트
  - Owner: @agent
  - Checklist:
    - [x] 젠가 타워 렌더링 확인
    - [x] 인터랙션 동작 확인

---

## 완료 조건

- [x] 모든 태스크 [DONE]
- [x] `pnpm dev` 정상 실행
- [x] `pnpm test` 통과 (23개)
- [x] 3D 젠가 타워 표시 및 인터랙션 동작
