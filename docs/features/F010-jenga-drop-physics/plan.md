# Implementation Plan: Jenga Drop Physics

> 스펙이 승인된 후 작성합니다.
> 기술적인 "어떻게"를 다룹니다.

---

## 개요

- **기능 ID**: F010
- **스펙 버전**: v1.0
- **작성일**: 2026-01-15
- **상태**: Review

---

## 기술 스택

| 구분 | 선택 | 이유 |
| --- | --- | --- |
| 물리 엔진 | @react-three/rapier | R3F 친화적, 안정적 스태킹, 성능/유지보수 우수 |
| 3D 렌더링 | @react-three/fiber | 기존 렌더링 파이프라인 유지 |
| 3D 유틸 | @react-three/drei | 카메라/툴팁/지오메트리 유틸 유지 |

---

## 아키텍처

패키지 데이터 → 레이아웃 계산 → 순차 스폰 → 1차 정착 → 붕괴 임펄스 → 2차 정착 → 일시정지

```
ResultView
└── JengaScene
    ├── Physics (paused after collapse settles)
    │   ├── Ground (RigidBody: fixed)
    │   └── JengaTower (sequential spawn)
    │       └── JengaBlock (mesh + hover/click)
    └── OrbitControls
```

---

## 파일 구조

```
src/
└── features/
    └── jenga-tower/
        ├── model/
        │   └── jenga-layout.ts        # 블록 레이아웃 계산 (NEW)
        └── ui/
            ├── jenga-scene.tsx        # Physics 래핑 + 바닥 콜라이더
            ├── jenga-tower.tsx        # 순차 스폰 + 붕괴 임펄스 + 정착 감지
            └── jenga-block.tsx        # 호버 시 월드 좌표 사용
```

추가 변경:
- `package.json`: `@react-three/rapier` 의존성 추가

---

## 데이터 모델

- 변경 없음 (기존 `PackageVulnerability`, `BlockData` 재사용)

---

## API 설계

- 해당 없음 (UI/클라이언트 로직)

---

## 테스트 전략

- **단위 테스트**: `jenga-layout.ts` 레이아웃 계산 (층 수, 슬롯 배치, 취약 블록 위치 규칙)
- **통합 테스트**: 스폰 시퀀스가 중복 실행되지 않는지, 붕괴 임펄스 이후 최종 정착 콜백 호출
- **수동 테스트**:
  - 결과 화면 진입 시 블록이 위에서 순차적으로 떨어짐
  - 1차 정착 이후 취약 블록에 임펄스가 적용되어 붕괴 연출이 발생
  - 2차 정착 이후 상호작용 상태로 전환
  - 패널 호버/블록 호버가 정상 동작
  - 새 결과 로드 시 애니메이션이 1회만 실행

---

## 리스크 & 완화

| 리스크 | 완화 방안 |
| --- | --- |
| 물리 시뮬레이션으로 인한 프레임 저하 | 스폰 간격 조정, sleep 설정, 정착 후 Physics `paused` | 
| 블록 정착 불안정 | 콜라이더 크기 조정, damping/마찰 튜닝, 드롭 높이 제한 |
| 재생성 시 중복 애니메이션 | 타워 키 리셋 + 타이머 정리, 마운트 시 초기화 |
| 붕괴로 카메라 밖으로 이탈 | 임펄스 강도 제한, 카메라 거리 상향 조정 |

---

## 관련 문서

- Spec: [spec.md](./spec.md)
