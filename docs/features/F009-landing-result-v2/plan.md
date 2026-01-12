# Implementation Plan: 랜딩/결과 v2 톤 리디자인

> 스펙이 승인된 후 작성합니다.
> 기술적인 "어떻게"를 다룹니다.

---

## 개요

- **기능 ID**: F009
- **스펙 버전**: v1.0
- **작성일**: 2026-01-12
- **상태**: Approved

---

## 기술 스택

| 구분 | 선택 | 이유 |
| --- | --- | --- |
| UI 스타일 | Tailwind CSS | v2 톤 유틸리티/컴포넌트 스타일 적용 |
| 프레임워크 | Next.js App Router | 기존 구조 유지 |
| 3D 렌더링 | React Three Fiber + Drei | 기존 젠가 시각화 스타일 변경 |

---

## 아키텍처

- 랜딩/결과 뷰에서 v2 배경 클래스와 이미지 자산을 적용
- 결과 패널 UI와 3D 블럭 머티리얼/색상 팔레트를 component-v2 기준으로 맞춤

```
[LandingView] -> [DependencyParserForm]
[ResultView] -> [VulnerabilityPanel] + [JengaScene/JengaBlock]
```

---

## 파일 구조

```
src/
├── app/
│   └── globals.css
├── widgets/
│   ├── home/ui/home-view.tsx
│   └── result/ui/result-view.tsx
├── features/
│   ├── dependency-parser/ui/dependency-parser-form.tsx
│   ├── vulnerability-analyzer/ui/vulnerability-panel.tsx
│   └── jenga-tower/ui/jenga-block.tsx
public/
└── images/
    ├── background-v2.png
    └── landing-image.png
```

---

## 데이터 모델

- 변경 없음

---

## API 설계

- 변경 없음

---

## 테스트 전략

- **단위 테스트**: 없음(스타일 변경)
- **통합 테스트**: 없음
- **E2E 테스트**: 없음
- **수동 테스트**:
  - 랜딩 배경/로고/입력폼/버튼 v2 톤 확인
  - 결과 화면 공유 버튼 위치 유지(헤더 영역) 확인
  - 3D 블럭 색상/광택/테두리 v2 배지 컬러 정합 확인
  - 모바일/데스크톱 반응형 확인

---

## 리스크 & 완화

| 리스크 | 완화 방안 |
| --- | --- |
| 밝은 배경에서 대비 저하 | 카드/버튼 보더 및 그림자 강화, 수동 검수 |
| 3D 블럭 색상 식별 저하 | component-v2 배지 컬러 고정 및 엣지 강조 |

---

## 관련 문서

- Spec: [spec.md](./spec.md)
- Decisions: [decisions.md](./decisions.md)
