import type { Dependency, ParsedPackage } from "@/entities/dependency/model/types";
import { packageJsonSchema, type PackageJsonRawInput } from "@/features/dependency-parser/model/schemas";

/**
 * package.json 객체에서 의존성 정보를 추출합니다.
 *
 * @param packageJson - 파싱된 package.json 객체
 * @returns 구조화된 의존성 정보
 */
export function parseDependencies(packageJson: PackageJsonRawInput): ParsedPackage {
  const dependencies: Dependency[] = [];

  // dependencies 파싱
  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      dependencies.push({
        name,
        version,
        isDev: false,
      });
    }
  }

  // devDependencies 파싱
  if (packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      dependencies.push({
        name,
        version,
        isDev: true,
      });
    }
  }

  return {
    name: packageJson.name ?? "unknown",
    version: packageJson.version ?? "0.0.0",
    dependencies,
  };
}

/**
 * package.json 문자열을 파싱하여 의존성 정보를 추출합니다.
 *
 * @param jsonString - package.json 문자열
 * @returns 구조화된 의존성 정보
 * @throws JSON 파싱 실패 시 에러
 */
export function parsePackageJsonString(jsonString: string): ParsedPackage {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error("JSON 형식이 올바르지 않습니다. package.json 내용을 확인해주세요.");
  }

  // 기본 검증: 객체인지 확인
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("package.json은 객체 형식이어야 합니다.");
  }

  // 런타임 스키마 검증
  const result = packageJsonSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("package.json 형식이 올바르지 않습니다.");
  }

  return parseDependencies(result.data);
}

