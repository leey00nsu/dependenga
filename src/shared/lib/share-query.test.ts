import { describe, it, expect } from "vitest";
import { decodeDependencies, encodeDependencies } from "./share-query";
import type { Dependency } from "@/entities/dependency/model/types";

describe("share-query", () => {
  it("의존성 목록을 인코딩/디코딩할 수 있다", () => {
    const deps: Dependency[] = [
      { name: "react", version: "19.2.3", isDev: false },
      { name: "vitest", version: "^4.0.16", isDev: true },
    ];

    const encoded = encodeDependencies(deps);
    const decoded = decodeDependencies(encoded);

    expect(decoded).toEqual(deps);
  });

  it("잘못된 인코딩 데이터는 에러를 던진다", () => {
    expect(() => decodeDependencies("invalid"))
      .toThrow("공유 데이터 형식이 올바르지 않습니다.");
  });
});
