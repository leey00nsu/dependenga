import { describe, it, expect } from "vitest";
import { buildJengaLayout } from "./jenga-layout";
import type { PackageVulnerability } from "@/entities/vulnerability/model/types";

const createPackage = (
  packageName: string,
  severity: PackageVulnerability["maxSeverity"],
  vulnerabilityCount = 0
): PackageVulnerability => ({
  packageName,
  version: "1.0.0",
  vulnerabilities: Array.from({ length: vulnerabilityCount }, (_, index) => ({
    id: `VULN-${packageName}-${index}`,
    severity: severity === "safe" ? "low" : severity,
    title: "test",
    affectedVersions: "*",
  })),
  maxSeverity: severity,
});

describe("buildJengaLayout", () => {
  it("패키지 수에 맞춰 블록과 레이어를 계산한다", () => {
    const packages = [
      createPackage("vuln-a", "high", 1),
      createPackage("safe-a", "safe"),
      createPackage("safe-b", "safe"),
    ];

    const layout = buildJengaLayout(packages);

    expect(layout.totalLayerCount).toBe(3);
    expect(layout.blocks).toHaveLength(9);
    expect(layout.blocks.filter((block) => block.package).length).toBe(3);
  });

  it("safe 패키지가 많으면 추가 레이어를 생성한다", () => {
    const packages = [
      createPackage("vuln-a", "critical", 1),
      createPackage("safe-a", "safe"),
      createPackage("safe-b", "safe"),
      createPackage("safe-c", "safe"),
      createPackage("safe-d", "safe"),
      createPackage("safe-e", "safe"),
    ];

    const layout = buildJengaLayout(packages);

    expect(layout.totalLayerCount).toBe(4);
    expect(layout.blocks).toHaveLength(12);
    expect(layout.blocks.filter((block) => block.package).length).toBe(6);
  });

  it("패키지가 없으면 기본 레이어를 유지한다", () => {
    const layout = buildJengaLayout([]);

    expect(layout.totalLayerCount).toBe(3);
    expect(layout.blocks).toHaveLength(9);
    expect(layout.blocks.filter((block) => block.package).length).toBe(0);
  });
});
