# Features 가이드

기능별 스펙, 계획, 태스크를 관리하는 폴더입니다.

## 폴더 구조

```
features/
├── README.md           # 이 파일
├── feature-base/       # 템플릿 (복제용)
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   └── research.md
├── F001-{feature-name}/
├── F002-{feature-name}/
└── ...
```

## 새 기능 생성

```bash
./docs/scripts/new-feature.sh F001 dependency-parser
```

또는 수동으로 `feature-base/`를 복제:

```bash
cp -r docs/features/feature-base docs/features/F001-dependency-parser
```

## 기능 ID 규칙

- `F{번호}-{기능명}` (예: F001-dependency-parser)
- 번호는 3자리 패딩 (001, 002, ...)
- 기능명은 kebab-case

## 각 파일 역할

| 파일 | 역할 | 작성 시점 |
| --- | --- | --- |
| `spec.md` | **무엇을, 왜** 만드는지 | 기능 정의 시 |
| `plan.md` | **어떻게** 만드는지 (기술) | 스펙 승인 후 |
| `tasks.md` | 구체적인 작업 목록 | 계획 승인 후 |
| `research.md` | 기술 조사 기록 | 필요시 |

## 라이프사이클

```
1. spec.md 작성 → 사용자 리뷰
2. plan.md 작성 → 사용자 리뷰  
3. tasks.md 작성 → 구현 시작
4. 구현 완료 → tasks.md 상태 업데이트
```
