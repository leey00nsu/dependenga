# Tasks: Jenga Drop Physics

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

### Phase 1: 기반 구성

- [TODO][P1] T-F010-01 물리 엔진 도입 및 씬 스캐폴딩
  - Owner: @me
  - Status Log: 2026-01-15 [TODO]
  - Acceptance:
    - `@react-three/rapier` 의존성이 추가된다
    - JengaScene에 Physics 컨텍스트와 바닥 콜라이더가 적용된다
  - Checklist:
    - [ ] `package.json`에 `@react-three/rapier` 추가
    - [ ] `JengaScene`에 `<Physics>` 래핑 및 Ground 구성

- [TODO][P1] T-F010-02 레이아웃 계산 분리 및 순차 스폰
  - Owner: @me
  - Status Log: 2026-01-15 [TODO]
  - Acceptance:
    - 레이아웃 계산 로직이 분리된다
    - 블록이 위에서 순차적으로 스폰되어 떨어진다
  - Checklist:
    - [ ] `jenga-layout.ts` 생성 및 기존 배치 로직 분리
    - [ ] `JengaTower`에서 스폰 타이밍 제어

### Phase 2: 정착 감지 및 상호작용 정리

- [TODO][P1] T-F010-03 정착 감지 및 Physics 일시정지
  - Owner: @me
  - Status Log: 2026-01-15 [TODO]
  - Acceptance:
    - 모든 블록 정착 시 완료 상태로 전환된다
    - 정착 이후 Physics가 일시정지된다
  - Checklist:
    - [ ] 블록 sleep/속도 기준 정착 판정
    - [ ] 정착 완료 시 콜백 또는 상태 플래그 처리

- [TODO][P2] T-F010-04 회귀 검증 및 간단 테스트
  - Owner: @me
  - Status Log: 2026-01-15 [TODO]
  - Acceptance:
    - 기본 상호작용(호버/패널 하이라이트)이 유지된다
    - 새 결과 로드 시 애니메이션이 1회만 실행된다
  - Checklist:
    - [ ] 수동 시나리오 체크리스트 업데이트
    - [ ] (가능 시) 레이아웃 계산 단위 테스트 추가

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
