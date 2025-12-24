# GitHub PR 템플릿 가이드

에이전트가 Pull Request를 생성할 때 참조하는 템플릿입니다.

---

## PR 생성 규칙

### 제목 형식
```text
feat(#{이슈번호}): {기능명}
```
예: `feat(#1): 의존성 파서 구현`

### 링크 형식 (중요!)

PR 본문에서 레포 내 파일 링크는 **반드시 현재 브랜치명을 사용**:
```markdown
[파일명](https://github.com/leey00nsu/dependenga/blob/{브랜치명}/docs/path/to/file.md)
```

> ⚠️ `main` 브랜치 링크는 머지 전까지 404가 발생합니다!
> 반드시 **현재 피처 브랜치명** (예: `feat/5-vulnerability-analysis`)을 사용하세요.

---

## PR 본문 템플릿

```markdown
## 개요
{변경 사항에 대한 간략한 설명}

## 변경 사항
- {변경 1}
- {변경 2}
- {변경 3}

## 테스트
- [ ] 유닛 테스트 통과
- [ ] 브라우저 테스트 완료
- [ ] `pnpm dev` 정상 실행

## 관련 문서
- [Spec](https://github.com/leey00nsu/dependenga/blob/{브랜치명}/docs/features/F{번호}-{기능명}/spec.md)
- [Tasks](https://github.com/leey00nsu/dependenga/blob/{브랜치명}/docs/features/F{번호}-{기능명}/tasks.md)

Closes #{이슈번호}
```

---

## PR 생성 명령어

```bash
# 현재 브랜치명 확인
BRANCH=$(git branch --show-current)

gh pr create \
  --title "feat(#{issue}): {기능명}" \
  --body "## 개요
{설명}

## 변경 사항
- {변경 1}
- {변경 2}

## 테스트
- [x] 유닛 테스트 통과
- [x] 브라우저 테스트 완료

## 관련 문서
- [Spec](https://github.com/leey00nsu/dependenga/blob/${BRANCH}/docs/features/F{번호}-{기능명}/spec.md)
- [Tasks](https://github.com/leey00nsu/dependenga/blob/${BRANCH}/docs/features/F{번호}-{기능명}/tasks.md)

Closes #{issue}" \
  --base main
```
