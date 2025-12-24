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

PR 본문에서 레포 내 파일 링크는 **반드시 전체 URL**을 사용:
```markdown
[파일명](https://github.com/leey00nsu/dependenga/blob/main/docs/path/to/file.md)
```

> ⚠️ `./docs/...` 또는 `docs/...` 형식은 **동작하지 않습니다**. 
> 반드시 `https://github.com/{owner}/{repo}/blob/{branch}/...` 형식을 사용하세요.

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
- [Spec](https://github.com/leey00nsu/dependenga/blob/main/docs/features/F{번호}-{기능명}/spec.md)
- [Tasks](https://github.com/leey00nsu/dependenga/blob/main/docs/features/F{번호}-{기능명}/tasks.md)

Closes #{이슈번호}
```

---

## PR 생성 명령어

```bash
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

Closes #{issue}" \
  --base main
```
