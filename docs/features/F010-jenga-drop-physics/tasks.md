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

- [DONE] (P1) T-F010-01 물리 엔진 도입 및 씬 스캐폴딩
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - `@react-three/rapier` 의존성이 추가된다
    - JengaScene에 Physics 컨텍스트와 바닥 콜라이더가 적용된다
  - Checklist:
    - [x] `package.json`에 `@react-three/rapier` 추가
    - [x] `JengaScene`에 `<Physics>` 래핑 및 Ground 구성

- [DONE] (P1) T-F010-02 레이아웃 계산 분리 및 순차 스폰
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - 레이아웃 계산 로직이 분리된다
    - 블록이 위에서 순차적으로 스폰되어 떨어진다
  - Checklist:
    - [x] `jenga-layout.ts` 생성 및 기존 배치 로직 분리
    - [x] `JengaTower`에서 스폰 타이밍 제어

### Phase 2: 정착 감지 및 상호작용 정리

- [DONE] (P1) T-F010-03 정착 감지 및 Physics 일시정지
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - 모든 블록 정착 시 완료 상태로 전환된다
    - 정착 이후 Physics가 일시정지된다
  - Checklist:
    - [x] 블록 sleep/속도 기준 정착 판정
    - [x] 정착 완료 시 콜백 또는 상태 플래그 처리

- [DONE] (P2) T-F010-04 회귀 검증 및 간단 테스트
  - Owner: @me
  - Status Log:
    - 2026-01-15 [REVIEW]
    - 2026-01-15 [DONE]
  - Acceptance:
    - 기본 상호작용(호버/패널 하이라이트)이 유지된다
    - 새 결과 로드 시 애니메이션이 1회만 실행된다
  - Checklist:
    - [x] 수동 시나리오 체크리스트 업데이트
    - [x] (가능 시) 레이아웃 계산 단위 테스트 추가
  - 수동 시나리오 체크리스트:
    - [x] 결과 화면 진입 시 블록이 위에서 순차적으로 떨어짐
    - [x] 정착 이후 패널 호버/블록 호버가 정상 동작
    - [x] 새 결과 로드 시 애니메이션이 1회만 실행

- [DONE] (P1) T-F010-05 스폰 이펙트 Strict Mode 대응
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - Strict Mode 환경에서도 블록이 정상적으로 스폰된다
    - 타이머 정리가 중복 실행되지 않는다
  - Checklist:
    - [x] 스폰 이펙트 가드 제거 및 재스케줄 보장

- [DONE] (P1) T-F010-06 취약 블록 불안정 파라미터 및 임펄스 적용
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - 취약 블록에 낮은 마찰/댐핑이 적용된다
    - 정착 직후 임펄스/토크로 붕괴가 유도된다
  - Checklist:
    - [x] 심각도별 물리 파라미터 설정
    - [x] 취약 블록 임펄스 트리거 구현

- [DONE] (P1) T-F010-07 붕괴 후 정착 감지 및 완료 상태 전환
  - Owner: @me
  - Status Log:
    - 2026-01-15 [REVIEW]
    - 2026-01-15 [DONE]
  - Acceptance:
    - 붕괴 이후 최종 정착 시 상호작용 상태로 전환된다
    - Physics pause가 최종 정착 시점에만 적용된다
  - Checklist:
    - [x] 2단계 정착 감지 로직 적용
    - [x] 최종 정착 시 Physics pause 처리
    - [x] 붕괴 후 이탈 방지용 경계 콜라이더 추가
    - [x] Rapier unsafe aliasing 에러 방지

- [DONE] (P1) T-F010-08 OSV 심각도 매핑 보강
  - Owner: @me
  - Status Log: 2026-01-15 [DONE]
  - Acceptance:
    - CVSS 벡터 문자열에서도 심각도가 올바르게 분류된다
    - 샘플 package.json에서 critical/high/medium/low 분포가 반영된다
  - Checklist:
    - [x] OSV schema에 database_specific.severity 추가
    - [x] 심각도 결정 로직에 fallback 추가
    - [x] 관련 유닛 테스트 추가

### Phase 3: 렌더링 성능 개선

- [DONE] (P2) T-F010-09 정착 감지 폴링 간격 최적화
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 정착 판정 타이밍이 기존과 동일하게 유지된다
    - 정착 감지 루프의 CPU 사용량이 감소한다
  - Checklist:
    - [x] 정착 감지 프레임 샘플링 적용
    - [x] 붕괴/최종 정착 흐름 정상 동작 확인

- [DONE] (P2) T-F010-10 블록 Suspense 경계 정리
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 블록 렌더링/상호작용이 동일하게 유지된다
    - 불필요한 Suspense 트리 오버헤드가 제거된다
  - Checklist:
    - [x] 블록 컴포넌트의 Suspense 래핑 제거
    - [x] fallback 컴포넌트 유지 여부 정리

- [DONE] (P2) T-F010-11 호버 상태 업데이트 중복 방지
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 호버/툴팁 동작이 기존과 동일하다
    - 동일 대상에 대한 상태 업데이트가 줄어든다
  - Checklist:
    - [x] 최근 호버 대상 캐시로 중복 setState 방지
    - [x] 패널/블록 호버 연동 영향 확인

- [DONE] (P2) T-F010-12 Physics pause 시 frameloop 절전 모드
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 정착 이후 idle 렌더링이 줄어든다
    - 호버/클릭 등 상호작용 갱신이 유지된다
  - Checklist:
    - [x] Canvas frameloop을 상태 기반으로 전환
    - [x] 새 결과 로드시 항상 모드 복구 확인

- [DONE] (P3) T-F010-13 고 DPI dpr 상한 설정
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 고해상도 환경에서 렌더링 비용이 감소한다
    - 시각적 품질 변화가 미미하다
  - Checklist:
    - [x] Canvas dpr 상한 설정
    - [x] 주요 UI/블록 렌더링 확인

- [DONE] (P3) T-F010-14 그림자 맵 해상도 조정
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 그림자 품질이 크게 훼손되지 않는다
    - GPU 부하가 감소한다
  - Checklist:
    - [x] 방향광 shadow-mapSize 축소
    - [x] 그림자 표시 정상 확인

### Phase 4: 코드 리뷰 반영

- [DONE] (P2) T-F010-15 레이아웃 키 안정화(패키지 정렬)
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 입력 패키지 순서와 무관하게 레이아웃 키가 동일하다
    - vulnerable/safe 분리 결과가 안정적으로 유지된다
  - Checklist:
    - [x] 패키지 정렬 유틸 추가
    - [x] 정렬된 배열로 키 생성 및 그룹 분리 적용

- [DONE] (P2) T-F010-16 호버 중복키 개선
  - Owner: @me
  - Status Log:
    - 2026-01-16 [DOING]
    - 2026-01-16 [DONE]
  - Acceptance:
    - 동일 packageName의 다른 버전/블록도 정상 호버 갱신된다
    - 기존 호버 동작이 유지된다
  - Checklist:
    - [x] 호버 dedupe 키에 version 또는 고유 식별자 포함
    - [x] 패널 연동 영향 확인

---

## 완료 조건

- [x] 모든 태스크 [DONE]
- [x] 모든 테스트 통과
- [x] 문서 업데이트 완료
- [ ] 코드 리뷰 완료
