# Decisions Log

기술 결정과 그 이유를 기록합니다.

> 형식: `D{번호}: {결정 제목} ({YYYY-MM-DD})`

---

## D001: v2 톤을 전역 유틸리티 + 이미지 배경으로 적용 (2026-01-12)

- **Context**: 랜딩/결과 화면의 톤을 디자인 산출물(landing-v2/result-v2/component-v2)에 맞춰 통일해야 함.
- **Options**: (1) 기존 다크 테마 유지 + 부분 스타일 변경 (2) v2 색상 토큰/유틸리티 추가 + 배경 이미지 적용
- **Decision**: v2 색상 토큰과 유틸리티 클래스를 추가하고 배경 이미지를 사용해 전체 톤을 전환.
- **Rationale**: 랜딩/결과/컴포넌트 전반에 일관된 톤을 적용하기 쉽고, 디자인 산출물과 시각적으로 가장 근접.
- **Consequences**: 전역 색상/그림자/테두리 스타일이 변경되어 UI 대비를 재검수해야 함.

## D002: 결과 화면 액션은 공유 버튼만 유지 (2026-01-12)

- **Context**: 결과 화면의 액션 구성에서 Analyze 버튼 필요 여부 검토.
- **Options**: (1) Analyze 버튼 추가 (2) 공유 버튼만 유지하고 기존 위치를 유지
- **Decision**: Analyze 버튼은 추가하지 않고 공유 버튼은 현재 위치(헤더 영역)를 유지.
- **Rationale**: 현재 사용자 흐름과 UI 구성의 일관성을 유지하고 불필요한 액션 추가를 피함.
- **Consequences**: 결과 화면에서 재분석 유도는 랜딩으로 이동하는 CTA로 대체 가능.

## D003: 3D 블럭 색상 팔레트는 component-v2 배지 컬러 사용 (2026-01-12)

- **Context**: 3D 블럭 색상이 결과 디자인의 배지 톤과 일치해야 함.
- **Options**: (1) 기존 팔레트 유지 (2) component-v2 배지 컬러로 교체
- **Decision**: component-v2 배지 컬러를 3D 블럭 색상으로 사용.
- **Rationale**: 결과 화면과 3D 시각화의 톤을 일관되게 유지하기 위함.
- **Consequences**: 배경 대비를 위해 엣지/하이라이트 튜닝 필요.

## D004: Jua 폰트 preload 비활성화로 한글 로딩 유지 (2026-01-13)

- **Context**: Jua의 `subsets` 타입에 "korean"이 포함되지 않아 TypeScript 에러가 발생함.
- **Options**: (1) `subsets`에 "korean"을 추가하고 타입을 무시 (2) `preload: false`로 전환 (3) `next/font/local`로 전환
- **Decision**: `preload: false`로 설정하고 `subsets` 지정 없이 Jua를 사용.
- **Rationale**: 공식 문서의 권장 방식에 맞추면서 타입 에러 없이 한글 로딩을 유지하기 위함.
- **Consequences**: 초기 폰트 로딩이 다소 늦어질 수 있어 필요 시 로컬 폰트 전환 검토.
