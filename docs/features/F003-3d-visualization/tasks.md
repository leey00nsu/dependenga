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

## Phase 6: UI 리디자인

- [DONE][P2] T-F003-08 초기 화면 (Initial State)
  - Owner: @agent
  - Checklist:
    - [x] 중앙 입력 카드 UI (GitHub URL / package.json 탭)
    - [x] Analyze Dependencies CTA 버튼
    - [x] 단색 민트 그린 배경 (#E8F5E9)

- [TODO][P2] T-F003-09 분석 중 상태 (Loading State)
  - Owner: @agent
  - Checklist:
    - [ ] 입력 카드 페이드 아웃
    - [ ] 젠가 타워 쌓이는 애니메이션
    - [ ] "Analyzing dependencies..." 텍스트

- [DONE][P2] T-F003-10 분석 완료 화면 (Main State)
  - Owner: @agent
  - Checklist:
    - [x] 60/40 분할 레이아웃
    - [x] 왼쪽: 3D 젠가 (floating, shadowMaterial로 바닥 없음)
    - [x] 오른쪽: Vulnerability Panel

- [DONE][P2] T-F003-11 젠가 블록 비주얼 업데이트
  - Owner: @agent
  - Checklist:
    - [x] Safe: #BFC2C7 (웜 그레이)
    - [x] Critical: #E74C3C
    - [x] High: #F39C12
    - [x] Medium: #F1C40F
    - [x] Low: #2ECC71
    - [x] RoundedBox로 둥근 모서리
    - [x] bumpMap으로 미세한 나뭇결 텍스처

- [DONE][P2] T-F003-12 Vulnerability Panel
  - Owner: @agent
  - Checklist:
    - [x] Severity 카운트 배지
    - [x] 카드 기반 리스트
    - [x] 호버 시 젠가 블록 연동 (isHighlighted prop)

- [DONE][P2] T-F003-13 젠가 타워 구조 수정
  - Owner: @agent
  - Checklist:
    - [x] 최상단/최하단만 Safe 블록 레이어
    - [x] 중간 레이어는 취약 패키지 + Safe 블록 구조

---

## 완료 조건

- [x] Phase 1-5 태스크 [DONE]
- [/] Phase 6 태스크 (Loading animation 제외 완료)
- [x] `pnpm dev` 정상 실행
- [x] `pnpm test` 통과 (23개)
- [x] 3D 젠가 타워 표시 및 인터랙션 동작
- [x] 패널-블록 호버 동기화 동작


