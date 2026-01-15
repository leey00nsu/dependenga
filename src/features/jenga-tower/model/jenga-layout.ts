import type {
  PackageVulnerability,
  SeverityWithSafe,
} from "@/entities/vulnerability/model/types";

export const BLOCK_LENGTH = 3;
export const BLOCK_HEIGHT = 0.6;
export const BLOCK_WIDTH = 1;
export const BLOCK_GAP_XZ = 0.08;
export const BLOCK_GAP_Y = 0.05;

export const BLOCK_DIMENSIONS: [number, number, number] = [
  BLOCK_LENGTH,
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
];

const SEVERITY_OFFSET: Record<SeverityWithSafe, number> = {
  critical: 1.5,
  high: 1.2,
  medium: 0.8,
  low: 0.4,
  safe: 0,
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export interface JengaLayoutBlock {
  id: string;
  layer: number;
  slot: number;
  package: PackageVulnerability | null;
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: [number, number, number];
  isNormalLayer: boolean;
  isVulnerableSlot: boolean;
}

export interface JengaLayoutResult {
  key: string;
  blocks: JengaLayoutBlock[];
  totalLayerCount: number;
  middleLayerCount: number;
  towerHeight: number;
}

export function createJengaLayoutKey(
  packages: PackageVulnerability[]
): string {
  if (packages.length === 0) {
    return "empty";
  }

  return packages
    .map(
      (pkg) =>
        `${pkg.packageName}@${pkg.version}:${pkg.maxSeverity}:${pkg.vulnerabilities.length}`
    )
    .join("|");
}

export function buildJengaLayout(
  packages: PackageVulnerability[]
): JengaLayoutResult {
  const key = createJengaLayoutKey(packages);
  const vulnerablePackages = packages.filter((pkg) => pkg.maxSeverity !== "safe");
  const safePackages = packages.filter((pkg) => pkg.maxSeverity === "safe");

  const safeInMiddleLayers = vulnerablePackages.length * 2;
  const remainingSafePackages = Math.max(
    0,
    safePackages.length - safeInMiddleLayers
  );
  const additionalSafeLayers = Math.ceil(remainingSafePackages / 3);

  const middleLayerCount = Math.max(vulnerablePackages.length, 1) + additionalSafeLayers;
  const totalLayerCount = middleLayerCount + 2;

  const blocks: JengaLayoutBlock[] = [];
  let safePackageIndex = 0;
  let xAxisDirectionIndex = 0;
  let zAxisDirectionIndex = 0;

  for (let layer = 0; layer < totalLayerCount; layer++) {
    const isRotated = layer % 2 === 1;
    const y = layer * (BLOCK_HEIGHT + BLOCK_GAP_Y);
    const rotation: [number, number, number] = isRotated
      ? [0, Math.PI / 2, 0]
      : [0, 0, 0];

    const isBottomNormalLayer = layer === 0;
    const isTopNormalLayer = layer === totalLayerCount - 1;
    const isNormalLayer = isBottomNormalLayer || isTopNormalLayer;

    const vulnIndex = layer - 1;
    const vulnPkg =
      !isNormalLayer && vulnIndex < vulnerablePackages.length
        ? vulnerablePackages[vulnIndex]
        : null;

    const vulnSlotIndex = vulnPkg
      ? Math.floor(seededRandom(layer * 7 + 1) * 3)
      : -1;

    const pullOffset = vulnPkg ? SEVERITY_OFFSET[vulnPkg.maxSeverity] : 0;

    for (let slot = 0; slot < 3; slot++) {
      const isVulnerableSlot = slot === vulnSlotIndex;
      let pkg: PackageVulnerability | null = null;

      if (isVulnerableSlot && vulnPkg) {
        pkg = vulnPkg;
      } else if (!isNormalLayer) {
        if (safePackageIndex < safePackages.length) {
          pkg = safePackages[safePackageIndex];
          safePackageIndex += 1;
        }
      }

      const slotOffset = (slot - 1) * (BLOCK_WIDTH + BLOCK_GAP_XZ);
      let x = 0;
      let z = 0;

      if (!isRotated) {
        z = slotOffset;
        if (isVulnerableSlot && vulnPkg) {
          const goEast = xAxisDirectionIndex % 2 === 0;
          x = goEast ? pullOffset : -pullOffset;
        }
      } else {
        x = slotOffset;
        if (isVulnerableSlot && vulnPkg) {
          const goSouth = zAxisDirectionIndex % 2 === 0;
          z = goSouth ? pullOffset : -pullOffset;
        }
      }

      const position: [number, number, number] = [x, y, z];

      blocks.push({
        id: `layer-${layer}-slot-${slot}`,
        layer,
        slot,
        package: pkg,
        position,
        rotation,
        dimensions: BLOCK_DIMENSIONS,
        isNormalLayer,
        isVulnerableSlot,
      });
    }

    if (vulnPkg) {
      if (!isRotated) {
        xAxisDirectionIndex += 1;
      } else {
        zAxisDirectionIndex += 1;
      }
    }
  }

  const towerHeight =
    (totalLayerCount - 1) * (BLOCK_HEIGHT + BLOCK_GAP_Y) + BLOCK_HEIGHT;

  return {
    key,
    blocks,
    totalLayerCount,
    middleLayerCount,
    towerHeight,
  };
}
