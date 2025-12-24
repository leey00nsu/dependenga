import { describe, it, expect } from "vitest";
import { parseGithubUrl } from "./fetch-github-file";

describe("parseGithubUrl", () => {
  it("유효한 GitHub URL을 파싱한다", () => {
    const result = parseGithubUrl("https://github.com/vercel/next.js");

    expect(result.owner).toBe("vercel");
    expect(result.repo).toBe("next.js");
  });

  it("URL 끝에 슬래시가 있어도 파싱한다", () => {
    const result = parseGithubUrl("https://github.com/facebook/react/");

    expect(result.owner).toBe("facebook");
    expect(result.repo).toBe("react");
  });

  it("하이픈이 포함된 레포지토리명을 파싱한다", () => {
    const result = parseGithubUrl("https://github.com/tanstack/react-query");

    expect(result.owner).toBe("tanstack");
    expect(result.repo).toBe("react-query");
  });

  it("잘못된 URL 형식이면 에러를 던진다", () => {
    expect(() => parseGithubUrl("https://gitlab.com/owner/repo")).toThrow(
      "GitHub URL 형식이 올바르지 않습니다"
    );
  });

  it("owner나 repo가 없으면 에러를 던진다", () => {
    expect(() => parseGithubUrl("https://github.com/owner")).toThrow(
      "GitHub URL 형식이 올바르지 않습니다"
    );
  });

  it("브랜치 경로가 포함된 URL은 에러를 던진다", () => {
    expect(() =>
      parseGithubUrl("https://github.com/owner/repo/tree/main")
    ).toThrow("GitHub URL 형식이 올바르지 않습니다");
  });
});
