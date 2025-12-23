# Database Design

데이터 모델 설계 문서를 관리하는 폴더입니다.

## 파일 구조

```
db/
├── README.md           # 이 파일
├── schema-design.md    # Prisma 스키마 설계
└── changelog.md        # 스키마 변경 이력
```

## 설계 문서 작성 규칙

1. 새 모델 추가 시 `schema-design.md` 업데이트
2. 스키마 변경 시 `changelog.md`에 이력 기록
3. 관련 기능 문서와 상호 링크

## 참조

- Prisma 스키마: `/prisma/schema.prisma`
- 기능별 데이터 모델: `/docs/features/{id}/plan.md`
