# Agents Guide

코드 어시스턴트/에이전트가 일관된 코드 생성·리팩토링을 수행하도록 돕는 운영 규칙입니다.

---

## 참조 문서

- 프로젝트 원칙: `/docs/agents/constitution.md`
- **Git 워크플로우: `/docs/agents/git-workflow.md`**
- **이슈 템플릿: `/docs/agents/issue-template.md`**
- **PR 템플릿: `/docs/agents/pr-template.md`**
- PRD: `/docs/prd/{project}-prd.md`
- 기능 스펙: `/docs/features/{feature-id}/`
- 실행 계획 템플릿: `/docs/agents/plan-template.md`

---

## 📁 docs 표준 구조

에이전트 기반 개발을 위한 docs 폴더 구조입니다.

```
docs/
├── README.md           # 문서 안내
├── agents/             # 에이전트 운영 규칙
│   ├── agents.md       # 메인 규칙 (이 파일)
│   ├── constitution.md # 프로젝트 원칙
│   └── git-workflow.md # Git 자동화
├── prd/                # 제품 요구사항
│   └── {project}-prd.md
├── features/           # 기능별 문서 (FSD)
│   ├── feature-base/   # 템플릿
│   └── F00X-{name}/    # 각 기능
└── scripts/            # 유틸리티 (선택)
```

### 규칙

- **DB 설계**: Feature의 `plan.md`에 포함 (별도 `docs/db` 불필요)
- **API 설계**: Feature의 `spec.md` 또는 OpenAPI spec으로 관리
- **기술 결정**: Feature의 `decisions.md`에 기록 (ADR 스타일)

---

## 언어/코드 규칙

- 답변: 한국어
- 코드/파일명: 영어
- 주석/커밋: 한국어
- **날짜/시간: 사용자 PC의 시스템 시간 사용** (예: `2025-12-25`)

---

## 요청 유형별 프로세스

### 1. 새 기능 추가 요청

1. `/docs/features/feature-base/`를 복제하여 새 기능 폴더 생성 (F001, F002...)
2. `spec.md` 작성 - 무엇을, 왜 만드는지 (기술 스택 X)
3. 사용자에게 스펙 초안 확인 요청

### 2. 기능 스펙 → 계획 수립

1. 스펙이 명확한지 확인 (명확화 체크리스트)
2. `plan.md` 작성 - 기술 스택, 아키텍처, 파일 구조
3. **`decisions.md`에 주요 기술 결정 기록** (필수)
4. 사용자 승인 후 태스크 분해

### 3. 태스크 분해 및 실행

1. `plan-template.md`의 체크업 매크로 수행
2. `tasks.md`에 태스크 작성 (Acceptance/Checklist 필수)
3. 사용자 승인 후 실행
4. 상태 전환: `[TODO] → [DOING] → [REVIEW] → [DONE]`
5. 완료 시 커밋 메시지 제안

### 4. 분석/검토 요청

1. 체크업 매크로 수행
2. 분석 리포트 작성 (현재 상태, 문제점, 제안, 영향)
3. 변경 필요시 새 기능/태스크 생성 권장

---

## 태스크 관리 규칙

1. 새 태스크는 반드시 Acceptance/Checklist 포함
2. 상태 전환 시 날짜 기록 (YYYY-MM-DD)
3. 병렬 실행 가능 태스크는 `[P]` 마커 추가
4. 완료 시 기능 폴더 내 문서 갱신

---

## 🔄 Git 자동화 규칙

> 상세 내용: `/docs/agents/git-workflow.md`

### 마일스톤 = GitHub Issue

- 새 마일스톤 시작 시 GitHub Issue 생성
- 브랜치 생성: `feat/{issue-number}-{feature-name}`

### 태스크 = Commit (자동)

**태스크 완료 시 에이전트가 자동 실행:**

```bash
git add .
git commit -m "{type}(#{issue}): {description}"
```

### 마일스톤 완료 = PR (자동)

**모든 태스크 완료 시 에이전트가 자동 실행:**

```bash
git push origin {branch}
gh pr create --title "feat(#{issue}): {title}" --body "Closes #{issue}"
```

### CodeRabbit 리뷰 → Squash Merge

1. PR 생성 → CodeRabbit 자동 리뷰
2. 리뷰 코멘트 수정
3. 모든 리뷰 해결 → `gh pr merge --squash`

---

## 커밋 메시지 규칙

```
{type}(#{issue}): {description}
```

| Type | 예시 |
| --- | --- |
| `feat` | `feat(#123): 의존성 파서 구현` |
| `fix` | `fix(#123): 버전 파싱 오류 수정` |
| `refactor` | `refactor(#123): 파서 로직 분리` |
| `test` | `test(#123): 파서 테스트 추가` |
| `docs` | `docs(#123): 스펙 명확화` |

---

## 📋 ADR (Architecture Decision Records) 규칙

> `decisions.md`는 기술 결정과 그 이유를 기록하는 **필수** 문서입니다.

### 언제 기록하는가?

1. **기술/라이브러리 선택 시** (예: Three.js vs React Three Fiber)
2. **아키텍처 결정 시** (예: Server Action vs API Route)
3. **설계 트레이드오프 시** (예: 성능 vs 가독성)
4. **코드 리뷰 피드백 반영 시** (예: React Hooks 규칙 위반 수정)
5. **문제 해결 시** (예: 에러 핸들링 방식 변경)

### 기록 형식

```markdown
## D{번호}: {결정 제목} ({YYYY-MM-DD})

- **Context**: 문제 상황 또는 배경
- **Options**: 고려한 대안들
- **Decision**: 최종 선택
- **Rationale**: 선택 이유
- **Consequences**: 결과 및 영향 (선택사항)
```

### 예시

```markdown
## D001: 3D 렌더링 라이브러리 선택 (2025-12-24)

- **Context**: 젠가 타워 3D 시각화 필요
- **Options**: Three.js 직접 사용 vs React Three Fiber vs Babylon.js
- **Decision**: React Three Fiber
- **Rationale**: React 컴포넌트와 선언적 통합, drei 유틸리티, 커뮤니티 활성
- **Consequences**: @react-three/fiber, @react-three/drei 의존성 추가
```

### 에이전트 행동 규칙

- 태스크 진행 중 **기술 결정이 발생하면 즉시 `decisions.md`에 기록**
- 코드 리뷰 피드백으로 **접근 방식이 변경되면 새 결정으로 추가**
- **암묵적인 결정도 명시적으로 기록** (예: "기본값 사용" → 왜 기본값을 선택했는지)

