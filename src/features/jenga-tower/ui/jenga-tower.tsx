"use client";

import { useState, useCallback, useMemo } from "react";
import { Html } from "@react-three/drei";
import type { PackageVulnerability, SeverityWithSafe } from "@/entities/vulnerability/model/types";
import { JengaBlock, type BlockData } from "./jenga-block";

interface JengaTowerProps {
  packages: PackageVulnerability[];
  onBlockHover?: (data: BlockData | null) => void;
  onBlockClick?: (data: BlockData) => void;
  highlightedPackage?: string | null;
}

/**
 * 심각도별 튀어나옴 오프셋 (고정값)
 * 심각할수록 더 많이 당겨져 있음
 */
const SEVERITY_OFFSET: Record<SeverityWithSafe, number> = {
  critical: 1.5, // 가장 많이 튀어나옴
  high: 1.2,
  medium: 0.8,
  low: 0.4,
  safe: 0,       // 안전한 블록은 튀어나오지 않음
};

// 블록 크기 상수 (실제 젠가 비율: 길이 = 두께 * 3)
const BLOCK_LENGTH = 3;  // 블록 긴 방향 길이
const BLOCK_HEIGHT = 0.6; // 블록 높이  
const BLOCK_WIDTH = 1;   // 블록 두께 (3개가 나란히 서면 BLOCK_LENGTH와 같음)

/**
 * 시드 기반 랜덤 생성 (슬롯 위치 결정용)
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/**
 * 패키지 목록을 젠가 타워로 렌더링
 * - 취약점 패키지: 중간층에 층당 1개씩 배치
 * - Safe 패키지: 중간층의 나머지 2개 슬롯을 채움
 * - 맨 아래/위 층: 모두 Safe 블록 (filler)
 */
export function JengaTower({ 
  packages, 
  onBlockHover,
  onBlockClick, 
  highlightedPackage 
}: JengaTowerProps) {
  const [hoveredBlock, setHoveredBlock] = useState<BlockData | null>(null);

  const handleHover = useCallback((isHovered: boolean, data: BlockData) => {
    const newHovered = isHovered ? data : null;
    setHoveredBlock(newHovered);
    onBlockHover?.(newHovered);
  }, [onBlockHover]);

  // 취약점이 있는 패키지
  const vulnerablePackages = useMemo(() => {
    return packages.filter(pkg => pkg.maxSeverity !== "safe");
  }, [packages]);

  // Safe 패키지
  const safePackages = useMemo(() => {
    return packages.filter(pkg => pkg.maxSeverity === "safe");
  }, [packages]);

  // 층 수 계산:
  // - 중간층에 취약 패키지 1개 + Safe 패키지 2개 배치
  // - 취약 패키지보다 Safe 패키지가 많으면 추가 층 필요
  // - 취약 패키지 N개 → N개 층에서 2N개 Safe 슬롯 사용
  // - 남은 Safe 패키지 → 3개씩 추가 층에 배치
  const safeInMiddleLayers = vulnerablePackages.length * 2;
  const remainingSafePackages = Math.max(0, safePackages.length - safeInMiddleLayers);
  const additionalSafeLayers = Math.ceil(remainingSafePackages / 3);
  
  const middleLayerCount = Math.max(vulnerablePackages.length, 1) + additionalSafeLayers;
  const totalLayerCount = middleLayerCount + 2; // 아래/위 filler 층 추가

  // 블록 생성
  const blocks: React.ReactElement[] = [];
  
  // 패키지명 → 블록 위치 맵 (패널 호버 시 3D 툴팁 표시용)
  const packagePositions = new Map<string, [number, number, number]>();

  // Safe 패키지 인덱스 (중간층에서 사용)
  let safePackageIndex = 0;

  // X축 블록(짝수층)과 Z축 블록(홀수층)의 방향을 별도로 추적
  let xAxisDirectionIndex = 0; // 짝수층: 0=동, 1=서
  let zAxisDirectionIndex = 0; // 홀수층: 0=남, 1=북

  for (let layer = 0; layer < totalLayerCount; layer++) {
    // 층마다 90도 회전
    const isRotated = layer % 2 === 1;
    const y = layer * BLOCK_HEIGHT;
    const rotation: [number, number, number] = isRotated
      ? [0, Math.PI / 2, 0]
      : [0, 0, 0];

    // 첫 번째 층과 마지막 층: 모두 safe 블록 (filler)
    const isBottomNormalLayer = layer === 0;
    const isTopNormalLayer = layer === totalLayerCount - 1;
    const isNormalLayer = isBottomNormalLayer || isTopNormalLayer;
    
    // 중간층의 취약점 패키지
    const vulnIndex = layer - 1;
    const vulnPkg = (!isNormalLayer && vulnIndex < vulnerablePackages.length) 
      ? vulnerablePackages[vulnIndex] 
      : null;
    
    // 랜덤으로 취약점 블록 위치 결정 (0, 1, 2 중 하나)
    const vulnSlotIndex = vulnPkg 
      ? Math.floor(seededRandom(layer * 7 + 1) * 3) 
      : -1;
    
    // 심각도에 따른 고정 튀어나옴 거리
    const pullOffset = vulnPkg ? SEVERITY_OFFSET[vulnPkg.maxSeverity] : 0;
    
    // 3개 블록 생성
    for (let slotIndex = 0; slotIndex < 3; slotIndex++) {
      const isVulnerableSlot = slotIndex === vulnSlotIndex;
      
      // 패키지 결정
      let pkg: PackageVulnerability | null = null;
      
      if (isVulnerableSlot && vulnPkg) {
        // 취약점 블록
        pkg = vulnPkg;
      } else if (!isNormalLayer) {
        // 중간층의 빈 슬롯: Safe 패키지로 채움
        if (safePackageIndex < safePackages.length) {
          pkg = safePackages[safePackageIndex];
          safePackageIndex++;
        }
        // Safe 패키지가 부족하면 null (filler 블록)
      }
      // Normal Layer (맨 아래/위)는 filler 블록으로 채움
      
      // 슬롯의 기본 오프셋 (-1, 0, +1)
      const slotOffset = (slotIndex - 1) * BLOCK_WIDTH;

      let x = 0;
      let z = 0;

      if (!isRotated) {
        z = slotOffset;
        if (isVulnerableSlot && vulnPkg) {
          const goEast = (xAxisDirectionIndex % 2) === 0;
          x = goEast ? pullOffset : -pullOffset;
        }
      } else {
        x = slotOffset;
        if (isVulnerableSlot && vulnPkg) {
          const goSouth = (zAxisDirectionIndex % 2) === 0;
          z = goSouth ? pullOffset : -pullOffset;
        }
      }

      const blockPosition: [number, number, number] = [x, y, z];
      const isHighlighted = pkg?.packageName === highlightedPackage;
      
      // 패키지 위치 저장 (패널 호버 시 툴팁용)
      if (pkg) {
        packagePositions.set(pkg.packageName, blockPosition);
      }

      blocks.push(
        <JengaBlock
          key={`layer-${layer}-slot-${slotIndex}`}
          packageName={pkg?.packageName ?? "normal"}
          version={pkg?.version ?? ""}
          severity={pkg?.maxSeverity ?? "safe"}
          vulnerabilityCount={pkg?.vulnerabilities.length ?? 0}
          position={blockPosition}
          rotation={rotation}
          onHover={handleHover}
          onClick={onBlockClick}
          dimensions={[BLOCK_LENGTH, BLOCK_HEIGHT, BLOCK_WIDTH]}
          isHighlighted={isHighlighted}
        />
      );
    }
    
    // 취약블록이 있는 층이면 방향 카운터 증가
    if (vulnPkg) {
      if (!isRotated) {
        xAxisDirectionIndex++;
      } else {
        zAxisDirectionIndex++;
      }
    }
  }

  // 툴팁에 표시할 데이터 결정
  // 1. 3D 블록 직접 호버 (hoveredBlock)
  // 2. 패널에서 호버 (highlightedPackage)
  let tooltipData: { packageName: string; version: string; vulnerabilityCount: number; position?: [number, number, number] } | null = null;
  
  if (hoveredBlock && hoveredBlock.packageName !== "normal") {
    tooltipData = hoveredBlock;
  } else if (highlightedPackage) {
    const position = packagePositions.get(highlightedPackage);
    const pkg = packages.find(p => p.packageName === highlightedPackage);
    if (position && pkg) {
      tooltipData = {
        packageName: pkg.packageName,
        version: pkg.version,
        vulnerabilityCount: pkg.vulnerabilities.length,
        position,
      };
    }
  }

  return (
    <group>
      {blocks}

      {/* 호버 툴팁 - 3D 블록 호버 또는 패널 호버 시 블록 위치에 표시 */}
      {tooltipData && (
        <Html
          position={[
            tooltipData.position?.[0] ?? 0, 
            (tooltipData.position?.[1] ?? 0) + BLOCK_HEIGHT + 0.5, 
            tooltipData.position?.[2] ?? 0
          ]}
          center
          style={{
            pointerEvents: "none",
            whiteSpace: "nowrap",
            transform: "translateY(-100%)",
          }}
        >
          <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-lg px-3 py-2 shadow-xl">
            <div className="font-medium text-sm">{tooltipData.packageName}</div>
            <div className="text-xs text-gray-300">
              v{tooltipData.version}
            </div>
            <div className="text-xs mt-1">
              {tooltipData.vulnerabilityCount > 0 ? (
                <span className="text-red-400">
                  {tooltipData.vulnerabilityCount}개 취약점
                </span>
              ) : (
                <span className="text-green-400">✓ 안전</span>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
