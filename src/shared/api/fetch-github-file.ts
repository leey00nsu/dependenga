import type { GithubRepoInfo } from "@/entities/dependency/model/types";

/**
 * GitHub URL에서 owner와 repo를 추출합니다.
 *
 * @param url - GitHub 레포지토리 URL (예: https://github.com/owner/repo)
 * @returns 추출된 레포지토리 정보
 * @throws URL 형식이 올바르지 않으면 에러
 */
export function parseGithubUrl(url: string): GithubRepoInfo {
  const match = url.match(/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/?$/);
  if (!match) {
    throw new Error("GitHub URL 형식이 올바르지 않습니다.");
  }
  return {
    owner: match[1],
    repo: match[2],
  };
}

/**
 * raw.githubusercontent.com URL을 생성합니다.
 */
function buildRawUrl(owner: string, repo: string, branch: string, path: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/**
 * GitHub 레포지토리에서 package.json을 가져옵니다.
 * main 브랜치를 먼저 시도하고, 실패하면 master 브랜치를 시도합니다.
 *
 * @param url - GitHub 레포지토리 URL
 * @returns package.json 내용 (문자열)
 * @throws 파일을 찾을 수 없거나 접근 불가 시 에러
 */
export async function fetchGithubPackageJson(url: string): Promise<string> {
  const { owner, repo } = parseGithubUrl(url);

  const branches = ["main", "master"];

  for (const branch of branches) {
    const rawUrl = buildRawUrl(owner, repo, branch, "package.json");

    try {
      const response = await fetch(rawUrl, {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        return await response.text();
      }

      // 404가 아닌 다른 에러는 바로 throw
      if (response.status !== 404) {
        throw new Error(`GitHub 파일 접근 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("GitHub 파일 접근 실패")) {
        throw error;
      }
      // 네트워크 에러 등은 다음 브랜치 시도
    }
  }

  throw new Error(
    `package.json을 찾을 수 없습니다. 레포지토리에 package.json이 있는지 확인해주세요. (${owner}/${repo})`
  );
}
