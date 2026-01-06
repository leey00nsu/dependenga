# Dependenga 문서 구조 가이드

에이전트가 프로젝트를 빠르게 파악할 수 있도록 기능별로 문서를 분리하여 관리합니다.

## 폴더 구조

| 경로 | 목적 | 핵심 문서 |
| --- | --- | --- |
| `docs/agents/` | 에이전트 운영 규칙 | `agents.md`, `constitution.md`, `git-workflow.md`, `issue-template.md`, `pr-template.md`, `plan-template.md` |
| `docs/prd/` | 프로젝트 PRD | `README.md`, `dependenga-prd.md` |
| `docs/features/` | 기능별 스펙/계획/태스크 | `README.md`, `{feature-id}/spec.md`, `plan.md`, `tasks.md` |
| `docs/designs/` | 디자인 산출물 | `landing.png`, `dashboard.png` 등 |
| `docs/scripts/` | 자동화 스크립트 | `new-feature.sh` |

## 워크플로우

```
1. Constitution 확인 → 2. PRD 참조 → 3. Feature Spec 작성 → 4. 사용자 리뷰 → 5. Plan 작성 → 6. 사용자 리뷰 → 7. Tasks 분해 → 8. 구현
```

## 기능 스펙 생성

```bash
# 새 기능 스펙 생성
./docs/scripts/new-feature.sh F001 dependency-parser
```

## 링크 규칙

- 문서 내부 참조: 상대 경로 사용 (`../prd/dependenga-prd.md`)
- 코드 파일 링크: 상대 경로 사용 (`../../src/lib/parser.ts`)
- **GitHub Issue/PR 본문**: 절대 URL 사용 (`https://github.com/.../blob/main/...`)

## 상태 관리

태스크 상태: `[TODO]` → `[DOING]` → `[REVIEW]` → `[DONE]`
병렬 실행 가능 태스크: `[P]` 마커 추가
