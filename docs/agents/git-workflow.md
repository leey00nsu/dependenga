# Git 워크플로우 가이드

에이전트가 Git/GitHub 작업을 자동화하기 위한 규칙입니다.

---

## 핵심 개념

| 개념 | GitHub 매핑 | 설명 |
| --- | --- | --- |
| 마일스톤 | GitHub Issue | 기능 단위 작업 |
| 태스크 | Commit | 개별 구현 단위 |
| 기능 완료 | Pull Request | 마일스톤 완료 시 PR 생성 |

---

## 브랜치 전략

```
main
 └── feat/123-dependency-parser    # Issue #123 기반 브랜치
      ├── commit 1: feat(#123): package.json 파서 구현
      ├── commit 2: feat(#123): 의존성 트리 생성
      └── commit 3: test(#123): 파서 테스트 추가
```

### 브랜치 네이밍

```
{type}/{issue-number}-{feature-name}
```

| Type | 설명 |
| --- | --- |
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `docs` | 문서 |

**예시:**
- `feat/123-dependency-parser`
- `fix/456-vulnerability-score`

---

## 커밋 컨벤션

### 형식

```
{type}(#{issue}): {description}
```

### Type 목록

| Type | 설명 | 예시 |
| --- | --- | --- |
| `feat` | 새 기능 | `feat(#123): 의존성 파서 구현` |
| `fix` | 버그 수정 | `fix(#123): 버전 파싱 오류 수정` |
| `refactor` | 리팩토링 | `refactor(#123): 파서 로직 분리` |
| `test` | 테스트 | `test(#123): 파서 단위 테스트 추가` |
| `docs` | 문서 | `docs(#123): 스펙 명확화` |
| `style` | 코드 스타일 | `style(#123): 린트 오류 수정` |
| `chore` | 기타 | `chore(#123): 의존성 업데이트` |

---

## 자동화 워크플로우

### 1. 마일스톤 시작

```bash
# 1. GitHub Issue 생성 (마일스톤 = Issue)
# 2. 브랜치 생성
git checkout -b feat/{issue-number}-{feature-name}
```

### 2. 태스크 완료 시 자동 커밋

태스크 하나가 완료되면:

```bash
# 에이전트가 자동 실행
git add .
git commit -m "{type}(#{issue}): {task-description}"
```

**에이전트 규칙:**
- 태스크 완료 → 즉시 커밋
- 커밋 메시지는 컨벤션 준수
- 커밋 후 `tasks.md` 상태 업데이트

### 3. 마일스톤 완료 시 PR 생성

모든 태스크 완료 시:

```bash
# 에이전트가 자동 실행
git push origin feat/{issue-number}-{feature-name}
gh pr create --title "feat(#{issue}): {milestone-title}" \
  --body "Closes #{issue}" \
  --base main
```

### 4. 코드 리뷰 (CodeRabbit)

- PR 생성 시 CodeRabbit 자동 리뷰
- 리뷰 코멘트에 대해 수정 진행
- 수정 완료 후 추가 커밋

### 5. 머지

모든 리뷰 해결 시:

```bash
# Squash and Merge
gh pr merge --squash --delete-branch
```

---

## 에이전트 자동화 규칙

### 태스크 완료 시

```
1. 코드 변경 완료
2. git add .
3. git commit -m "{type}(#{issue}): {description}"
4. tasks.md 상태 [DOING] → [DONE] 업데이트
5. 다음 태스크 진행
```

### 마일스톤 완료 시

```
1. 모든 태스크 [DONE] 확인
2. git push origin {branch}
3. gh pr create
4. CodeRabbit 리뷰 대기
5. 리뷰 코멘트 수정
6. gh pr merge --squash
```

---

## GitHub 설정 요구사항

### 필수

- [ ] GitHub CLI (`gh`) 설치 및 인증
- [ ] CodeRabbit GitHub App 설치
- [ ] Branch protection rules (main)
  - Require PR before merging
  - Require review from CodeRabbit

### 권장

- [ ] Auto-delete head branches
- [ ] Squash merging only
