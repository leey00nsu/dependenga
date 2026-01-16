# Implementation Plan: 모바일 취약점 패널 접기

> 스펙이 승인된 후 작성합니다.
> 기술적인 "어떻게"를 다룹니다.

---

## 개요

- **기능 ID**: F011
- **스펙 버전**: v1.0
- **작성일**: 2026-01-16
- **상태**: Approved

---

## 기술 스택

| 구분 | 선택 | 이유 |
| --- | --- | --- |
| UI 상태 | React state | 모바일 토글 상태 관리 |
| 스타일 | Tailwind CSS | 반응형(`lg:`) 제어 및 트랜지션 |
| 컴포넌트 | Next.js Client Component | 결과 페이지는 클라이언트 상호작용 필요 |

---

## 아키텍처

ResultView에서 모바일 전용 토글 상태를 관리하고, 패널 영역은 `lg:` 브레이크포인트에서 항상 펼쳐지도록 한다. 모바일에서는 `isPanelOpen` 상태에 따라 패널 높이/투명도를 전환한다.

```
ResultView
├── JengaScene (배경)
└── VulnerabilityPanel (aside)
    ├── MobileToggleButton (모바일 전용)
    └── PanelContent (접힘/펼침)
```

---

## 파일 구조

```
src/
└── widgets/
    └── result/
        └── ui/
            └── result-view.tsx   # 모바일 토글 상태/레이아웃
src/
└── features/
    └── vulnerability-analyzer/
        └── ui/
            └── vulnerability-panel.tsx  # 패널 콘텐츠(필요시 props 추가)
```

---

## 데이터 모델

- 변경 없음

---

## API 설계

- 해당 없음

---

## 테스트 전략

- **단위 테스트**: 필요 시 토글 상태 로직 유닛 테스트 (선택)
- **통합 테스트**: 모바일/데스크톱 레이아웃 전환 시 패널 표시 상태 확인
- **수동 테스트**:
  - 모바일 뷰포트에서 기본 접힘 확인
  - 토글로 열기/닫기 동작 확인
  - 데스크톱 뷰포트에서 항상 펼침 유지

---

## 리스크 & 완화

| 리스크 | 완화 방안 |
| --- | --- |
| 모바일에서 토글 상태와 데스크톱 레이아웃 충돌 | `lg:` 브레이크포인트에서 상태 무시(항상 펼침) |
| 토글 버튼 접근성 누락 | `aria-expanded`, `aria-controls` 적용 |

---

## 관련 문서

- Spec: [spec.md](./spec.md)
- Decisions: [decisions.md](./decisions.md)
