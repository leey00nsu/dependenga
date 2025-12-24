# GitHub Issue 템플릿 가이드

에이전트가 GitHub Issue를 생성할 때 참조하는 템플릿입니다.

---

## 이슈 생성 규칙

### 제목 형식
```text
F{번호}: {기능명}
```
예: `F001: 의존성 파서 구현`

### 링크 형식 (중요!)

GitHub Issue에서 레포 내 파일 링크는 **반드시 전체 URL**을 사용:
```markdown
[파일명](https://github.com/leey00nsu/dependenga/blob/main/docs/path/to/file.md)
```

> ⚠️ `./docs/...` 또는 `docs/...` 형식은 **동작하지 않습니다**. 
> 반드시 `https://github.com/{owner}/{repo}/blob/{branch}/...` 형식을 사용하세요.

---

## 이슈 본문 템플릿

```markdown
## 개요
{기능에 대한 간략한 설명}

## 목표
- {목표 1}
- {목표 2}
- {목표 3}

## 완료 조건
- [ ] {조건 1}
- [ ] {조건 2}
- [ ] {조건 3}

## 관련 문서
- [PRD](https://github.com/leey00nsu/dependenga/blob/main/docs/prd/dependenga-prd.md)
- [Spec](https://github.com/leey00nsu/dependenga/blob/main/docs/features/F{번호}-{기능명}/spec.md)

## 라벨
- `enhancement` (새 기능)
- `bug` (버그 수정)
- `documentation` (문서)
```
