import { describe, it, expect } from "vitest";
import { parseDependencies, parsePackageJsonString } from "./parse-dependencies";
import type { PackageJsonRawInput } from "../model/schemas";

describe("parseDependencies", () => {
  it("dependencies와 devDependencies를 올바르게 파싱한다", () => {
    const input: PackageJsonRawInput = {
      name: "test-project",
      version: "1.0.0",
      dependencies: {
        react: "^18.2.0",
        next: "^14.0.0",
      },
      devDependencies: {
        typescript: "^5.0.0",
        eslint: "^8.0.0",
      },
    };

    const result = parseDependencies(input);

    expect(result.name).toBe("test-project");
    expect(result.version).toBe("1.0.0");
    expect(result.dependencies).toHaveLength(4);

    const prodDeps = result.dependencies.filter((d) => !d.isDev);
    const devDeps = result.dependencies.filter((d) => d.isDev);

    expect(prodDeps).toHaveLength(2);
    expect(devDeps).toHaveLength(2);

    expect(prodDeps.find((d) => d.name === "react")?.version).toBe("^18.2.0");
    expect(devDeps.find((d) => d.name === "typescript")?.version).toBe("^5.0.0");
  });

  it("dependencies가 없어도 동작한다", () => {
    const input: PackageJsonRawInput = {
      name: "minimal",
      version: "0.1.0",
    };

    const result = parseDependencies(input);

    expect(result.name).toBe("minimal");
    expect(result.dependencies).toHaveLength(0);
  });

  it("name과 version이 없으면 기본값을 사용한다", () => {
    const input: PackageJsonRawInput = {
      dependencies: { lodash: "^4.0.0" },
    };

    const result = parseDependencies(input);

    expect(result.name).toBe("unknown");
    expect(result.version).toBe("0.0.0");
  });
});

describe("parsePackageJsonString", () => {
  it("유효한 JSON 문자열을 파싱한다", () => {
    const jsonString = JSON.stringify({
      name: "test",
      version: "1.0.0",
      dependencies: { react: "^18.0.0" },
    });

    const result = parsePackageJsonString(jsonString);

    expect(result.name).toBe("test");
    expect(result.dependencies).toHaveLength(1);
  });

  it("잘못된 JSON 형식이면 에러를 던진다", () => {
    expect(() => parsePackageJsonString("{ invalid json }")).toThrow(
      "JSON 형식이 올바르지 않습니다"
    );
  });

  it("배열 형식이면 에러를 던진다", () => {
    expect(() => parsePackageJsonString("[]")).toThrow(
      "package.json은 객체 형식이어야 합니다"
    );
  });

  it("null이면 에러를 던진다", () => {
    expect(() => parsePackageJsonString("null")).toThrow(
      "package.json은 객체 형식이어야 합니다"
    );
  });
});
