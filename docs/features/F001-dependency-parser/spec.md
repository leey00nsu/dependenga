# Feature Spec: 의존성 파서

## 개요

- **기능 ID**: F001
- **기능명**: dependency-parser
- **작성일**: 2024-12-24
- **상태**: Draft
- **GitHub Issue**: [#1](https://github.com/leey00nsu/dependenga/issues/1)

---

## 목적

사용자가 입력한 package.json 또는 GitHub URL에서 의존성 정보를 추출하여 구조화된 데이터로 변환합니다. 이 데이터는 3D 젠가 시각화의 기반이 됩니다.

---

## 사용자 스토리

### US-1: package.json 직접 입력

**As a** 개발자  
**I want** package.json 내용을 붙여넣어 분석할 수 있기를  
**So that** 별도 업로드 없이 빠르게 분석할 수 있습니다.

**Acceptance Criteria:**
- [ ] package.json 텍스트 입력 영역 제공
- [ ] JSON 유효성 검증
- [ ] 파싱 오류 시 명확한 에러 메시지

### US-2: GitHub URL 입력

**As a** 개발자  
**I want** GitHub 레포 URL만 입력하면 자동으로 package.json을 가져오기를  
**So that** 빠르게 프로젝트를 분석할 수 있습니다.

**Acceptance Criteria:**
- [ ] GitHub URL 입력 필드 제공
- [ ] raw.githubusercontent.com에서 package.json 자동 추출
- [ ] 파일 없거나 접근 불가 시 에러 처리

### US-3: 의존성 트리 생성

**As a** 시스템  
**I want** 파싱된 의존성을 트리 구조로 변환하기를  
**So that** 시각화에 사용할 수 있습니다.

**Acceptance Criteria:**
- [ ] dependencies, devDependencies 분리
- [ ] 각 패키지의 버전 정보 추출
- [ ] 중첩 의존성은 현재 스코프 외 (추후 확장)

---

## 기능 요구사항

### FR-1: 입력 처리

- 두 가지 입력 모드: **직접 입력** / **GitHub URL**
- 탭 또는 토글로 모드 전환
- 입력 값 클라이언트 사이드 유효성 검증

### FR-2: GitHub URL 파싱

- 지원 포맷: `https://github.com/{owner}/{repo}`
- branch 미지정 시 기본값: `main` (실패 시 `master` 시도)
- raw URL 변환: `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/package.json`

### FR-3: 의존성 파싱

```typescript
interface Dependency {
  name: string;           // 패키지명
  version: string;        // 명시된 버전 (예: "^16.1.1")
  isDev: boolean;         // devDependency 여부
}

interface ParsedPackage {
  name: string;           // 프로젝트명
  version: string;        // 프로젝트 버전
  dependencies: Dependency[];
}
```

---

## 비기능 요구사항

- **성능**: 파싱 1초 이내
- **에러 처리**: 사용자 친화적 에러 메시지
- **접근성**: 키보드 탐색 지원

---

## 엣지 케이스

- package.json이 없는 레포
- private 레포 (현재 미지원, 명확한 에러)
- 잘못된 JSON 형식
- dependencies 필드 누락

---

## 스펙 외 (Out of Scope)

- package-lock.json / pnpm-lock.yaml 파싱
- 중첩 의존성 (node_modules 탐색)
- private 레포 인증
- 취약점 분석 (F002에서 진행)

---

## 관련 문서

- PRD: [dependenga-prd.md](../../prd/dependenga-prd.md)
- 다음 기능: F002-vulnerability-analysis
