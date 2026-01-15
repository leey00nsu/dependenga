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

- [DONE][P1] T-F010-01 물리 엔진 도입 및 씬 스캐폴딩
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - `@react-three/rapier` 의존성이 추가된다
    - JengaScene에 Physics 컨텍스트와 바닥 콜라이더가 적용된다
  - Checklist:
    - [x] `package.json`에 `@react-three/rapier` 추가
    - [x] `JengaScene`에 `<Physics>` 래핑 및 Ground 구성

- [DONE][P1] T-F010-02 레이아웃 계산 분리 및 순차 스폰
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - 레이아웃 계산 로직이 분리된다
    - 블록이 위에서 순차적으로 스폰되어 떨어진다
  - Checklist:
    - [x] `jenga-layout.ts` 생성 및 기존 배치 로직 분리
    - [x] `JengaTower`에서 스폰 타이밍 제어

### Phase 2: 정착 감지 및 상호작용 정리

- [DONE][P1] T-F010-03 정착 감지 및 Physics 일시정지
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - 모든 블록 정착 시 완료 상태로 전환된다
    - 정착 이후 Physics가 일시정지된다
  - Checklist:
    - [x] 블록 sleep/속도 기준 정착 판정
    - [x] 정착 완료 시 콜백 또는 상태 플래그 처리

- [REVIEW][P2] T-F010-04 회귀 검증 및 간단 테스트
  - Owner: @me
  - Status Log: 2026-01-15 [REVIEW]
  - Acceptance:
    - 기본 상호작용(호버/패널 하이라이트)이 유지된다
    - 새 결과 로드 시 애니메이션이 1회만 실행된다
  - Checklist:
    - [ ] 수동 시나리오 체크리스트 업데이트
    - [x] (가능 시) 레이아웃 계산 단위 테스트 추가

- [DONE][P1] T-F010-05 스폰 이펙트 Strict Mode 대응
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - Strict Mode 환경에서도 블록이 정상적으로 스폰된다
    - 타이머 정리가 중복 실행되지 않는다
  - Checklist:
    - [x] 스폰 이펙트 가드 제거 및 재스케줄 보장

- [DONE][P1] T-F010-06 취약 블록 불안정 파라미터 및 임펄스 적용
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - 취약 블록에 낮은 마찰/댐핑이 적용된다
    - 정착 직후 임펄스/토크로 붕괴가 유도된다
  - Checklist:
    - [x] 심각도별 물리 파라미터 설정
    - [x] 취약 블록 임펄스 트리거 구현

- [DONE][P1] T-F010-07 붕괴 후 정착 감지 및 완료 상태 전환
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - 붕괴 이후 최종 정착 시 상호작용 상태로 전환된다
    - Physics pause가 최종 정착 시점에만 적용된다
  - Checklist:
    - [x] 2단계 정착 감지 로직 적용
    - [x] 최종 정착 시 Physics pause 처리
    - [x] 붕괴 후 이탈 방지용 경계 콜라이더 추가
    - [x] Rapier unsafe aliasing 에러 방지 (physics step hook 사용)

---

## 완료 조건

- [ ] 모든 태스크 [DONE]
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
