import { osvResponseSchema, type OSVResponse } from "@/features/vulnerability-analyzer/model/schemas";

const OSV_API_URL = "https://api.osv.dev/v1/query";

/**
 * OSV API 요청 본문
 */
interface OSVQueryRequest {
  package: {
    name: string;
    ecosystem: "npm";
  };
  version: string;
}

/**
 * 버전 문자열을 정규화합니다.
 * 쿼리할 수 없는 버전은 null을 반환합니다.
 */
function normalizeVersion(version: string): string | null {
  const trimmed = version.trim();

  // 와일드카드, 태그, 범위 표현식은 쿼리 불가
  if (
    trimmed === "*" ||
    trimmed === "latest" ||
    trimmed === "next" ||
    trimmed.includes("x") ||
    trimmed.includes("||") ||
    trimmed.includes(" - ") ||
    /\s+(&&|\|\||\s)\s+/.test(trimmed)
  ) {
    return null;
  }

  // semver 범위 접두사 제거 (^, ~, >=, <=, >, <, =)
  const cleaned = trimmed.replace(/^[\^~>=<]+/, "");

  // 유효한 semver 형식인지 확인 (간단한 체크)
  if (!/^\d/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

/**
 * OSV API를 통해 패키지의 취약점을 조회합니다.
 *
 * @param packageName - npm 패키지명
 * @param version - 패키지 버전 (예: "1.0.0", semver 범위가 아닌 정확한 버전)
 * @returns OSV API 응답
 */
export async function queryOSV(packageName: string, version: string): Promise<OSVResponse> {
  // 버전 정규화: semver 범위, 와일드카드, 태그 등 처리
  const cleanVersion = normalizeVersion(version);

  // 쿼리할 수 없는 버전은 빈 결과 반환
  if (!cleanVersion) {
    return { vulns: [] };
  }

  const body: OSVQueryRequest = {
    package: {
      name: packageName,
      ecosystem: "npm",
    },
    version: cleanVersion,
  };

  try {
    const response = await fetch(OSV_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "force-cache", // 동일 요청 캐싱
    });

    if (!response.ok) {
      // 404는 취약점 없음으로 처리
      if (response.status === 404) {
        return { vulns: [] };
      }
      throw new Error(`OSV API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const parsed = osvResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.error("OSV 응답 파싱 실패:", parsed.error);
      return { vulns: [] };
    }

    return parsed.data;
  } catch (error) {
    console.error(`OSV 조회 실패 (${packageName}@${version}):`, error);
    return { vulns: [] };
  }
}

/**
 * 여러 패키지의 취약점을 일괄 조회합니다.
 * OSV API는 batch endpoint가 있지만, 현재는 개별 호출로 구현
 */
export async function queryOSVBatch(
  packages: Array<{ name: string; version: string }>
): Promise<Map<string, OSVResponse>> {
  const results = new Map<string, OSVResponse>();

  // 병렬 처리 (최대 5개씩)
  const batchSize = 5;
  for (let i = 0; i < packages.length; i += batchSize) {
    const batch = packages.slice(i, i + batchSize);
    const promises = batch.map(async (pkg) => {
      const response = await queryOSV(pkg.name, pkg.version);
      return { key: `${pkg.name}@${pkg.version}`, response };
    });

    const batchResults = await Promise.all(promises);
    for (const { key, response } of batchResults) {
      results.set(key, response);
    }
  }

  return results;
}
