# Schema Design

Prisma 스키마 설계 문서입니다.

---

## 모델 개요

| 모델 | 설명 | 관련 기능 |
| --- | --- | --- |
| Analysis | 분석 결과 | M4 |
| Dependency | 의존성 정보 | M1 |
| Vulnerability | 취약점 정보 | M2 |

---

## 상세 스키마

### Analysis

분석 요청 및 결과를 저장합니다.

```prisma
model Analysis {
  id          String   @id @default(cuid())
  source      String   // github_url | package_json
  sourceUrl   String?  // GitHub URL (optional)
  packageJson Json     // 원본 package.json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  dependencies Dependency[]
}
```

### Dependency

파싱된 의존성 정보를 저장합니다.

```prisma
model Dependency {
  id            String   @id @default(cuid())
  analysisId    String
  name          String   // 패키지명
  version       String   // 명시된 버전
  latestVersion String?  // 최신 버전
  isDev         Boolean  // devDependency 여부
  depth         Int      // 의존성 깊이 (0 = 직접)

  analysis        Analysis        @relation(fields: [analysisId], references: [id])
  vulnerabilities Vulnerability[]
}
```

### Vulnerability

취약점 정보를 저장합니다.

```prisma
model Vulnerability {
  id           String @id @default(cuid())
  dependencyId String
  severity     String // critical | high | medium | low
  title        String
  description  String?
  patchedIn    String? // 패치된 버전

  dependency Dependency @relation(fields: [dependencyId], references: [id])
}
```

---

## 인덱스

```prisma
@@index([analysisId])
@@index([dependencyId])
@@index([severity])
```

---

## 변경 이력

[changelog.md](./changelog.md) 참조
