# Implementation Plan: {기능명}

> 스펙이 승인된 후 작성합니다.
> 기술적인 "어떻게"를 다룹니다.

---

## 개요

- **기능 ID**: F{번호}
- **스펙 버전**: v1.0
- **작성일**: YYYY-MM-DD
- **상태**: Draft | Review | Approved

---

## 기술 스택

| 구분 | 선택 | 이유 |
| --- | --- | --- |
| (영역) | (기술) | (선택 이유) |

---

## 아키텍처

(컴포넌트 구조, 데이터 흐름 등)

```
[입력] → [처리] → [출력]
```

---

## 파일 구조

```
src/
├── app/
│   └── (routes)
├── components/
│   └── {feature}/
├── lib/
│   └── {feature}/
└── types/
```

---

## 데이터 모델

(필요시 Prisma 스키마 또는 타입 정의)

```prisma
model Example {
  id    Int    @id @default(autoincrement())
  name  String
}
```

---

## API 설계

### `POST /api/example`

**Request:**
```json
{
  "field": "value"
}
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 테스트 전략

- **단위 테스트**: (대상)
- **통합 테스트**: (시나리오)
- **E2E 테스트**: (필요시)

---

## 리스크 & 완화

| 리스크 | 완화 방안 |
| --- | --- |
| (리스크) | (방안) |

---

## 관련 문서

- Spec: [spec.md](./spec.md)
- Research: [research.md](./research.md)
