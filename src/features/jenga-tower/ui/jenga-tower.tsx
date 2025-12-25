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
 * - 취약점이 있는 패키지만 각 층에 1개씩 배치
 * - 각 층에는 2개의 정상 블록 + 1개의 취약점 블록 (랜덤 위치)
 * - 취약점 블록은 동→남→서→북 순서로 튀어나옴
 * - 맨 위에 정상 블록 층 추가
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

  // 취약점이 있는 패키지 분리
  const vulnerablePackages = useMemo(() => {
    return packages.filter(pkg => pkg.maxSeverity !== "safe");
  }, [packages]);

  // 취약점 층 수 계산 (최소 1층, 취약점마다 1층)
  // 맨 아래/위 정상 층을 제외한 중간 층 수
  const middleLayerCount = Math.max(vulnerablePackages.length, 1);
  const totalLayerCount = middleLayerCount + 2; // 아래/위 정상 층 추가

  // 블록 생성
  const blocks: React.ReactElement[] = [];

  // X축 블록(짝수층)과 Z축 블록(홀수층)의 방향을 별도로 추적
  // X축 블록: 첫번째는 동(+X), 두번째는 서(-X), 교대
  // Z축 블록: 첫번째는 남(+Z), 두번째는 북(-Z), 교대
  let xAxisDirectionIndex = 0; // 짝수층: 0=동, 1=서
  let zAxisDirectionIndex = 0; // 홀수층: 0=남, 1=북

  for (let layer = 0; layer < totalLayerCount; layer++) {
    // 층마다 90도 회전
    const isRotated = layer % 2 === 1;
    const y = layer * BLOCK_HEIGHT;
    const rotation: [number, number, number] = isRotated
      ? [0, Math.PI / 2, 0]
      : [0, 0, 0];

    // 첫 번째 층과 마지막 층만 정상 블록으로 가득 채움
    const isBottomNormalLayer = layer === 0;
    const isTopNormalLayer = layer === totalLayerCount - 1;
    const isNormalLayer = isBottomNormalLayer || isTopNormalLayer;
    
    // 취약점 블록 (해당 층에 배치할 취약점이 있으면)
    // layer 1부터 취약점 블록 배치 (layer-1로 인덱싱)
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
      const pkg = isVulnerableSlot && vulnPkg ? vulnPkg : null;
      
      // 슬롯의 기본 오프셋 (-1, 0, +1)
      const slotOffset = (slotIndex - 1) * BLOCK_WIDTH;

      let x = 0;
      let z = 0;

      if (!isRotated) {
        // 짝수 층: 블록이 X축 방향으로 길게 놓임
        // 3개 블록이 Z축 방향으로 나열됨
        z = slotOffset;
        
        // X축 블록은 동(+X) 또는 서(-X)로 슬라이드
        // 첫번째 X축 취약블록 → 동(+X), 두번째 X축 취약블록 → 서(-X), 교대
        if (isVulnerableSlot && vulnPkg) {
          const goEast = (xAxisDirectionIndex % 2) === 0;
          x = goEast ? pullOffset : -pullOffset;
        }
      } else {
        // 홀수 층: 블록이 Z축 방향으로 길게 놓임 (90도 회전)
        // 3개 블록이 X축 방향으로 나열됨
        x = slotOffset;
        
        // Z축 블록은 남(+Z) 또는 북(-Z)로 슬라이드
        // 첫번째 Z축 취약블록 → 남(+Z), 두번째 Z축 취약블록 → 북(-Z), 교대
        if (isVulnerableSlot && vulnPkg) {
          const goSouth = (zAxisDirectionIndex % 2) === 0;
          z = goSouth ? pullOffset : -pullOffset;
        }
      }

      blocks.push(
        <JengaBlock
          key={`layer-${layer}-slot-${slotIndex}`}
          packageName={pkg?.packageName ?? "normal"}
          version={pkg?.version ?? ""}
          severity={pkg?.maxSeverity ?? "safe"}
          vulnerabilityCount={pkg?.vulnerabilities.length ?? 0}
          position={[x, y, z]}
          rotation={rotation}
          onHover={handleHover}
          onClick={onBlockClick}
          dimensions={[BLOCK_LENGTH, BLOCK_HEIGHT, BLOCK_WIDTH]}
          isHighlighted={pkg?.packageName === highlightedPackage}
        />
      );
    }
    
    // 취약블록이 있는 층이면 방향 카운터 증가
    if (vulnPkg) {
      if (!isRotated) {
        xAxisDirectionIndex++; // 짝수층(X축 블록) 카운터
      } else {
        zAxisDirectionIndex++; // 홀수층(Z축 블록) 카운터
      }
    }
  }

  return (
    <group>
      {blocks}

      {/* 호버 툴팁 */}
      {hoveredBlock && hoveredBlock.packageName !== "normal" && (
        <Html
          position={[0, totalLayerCount * BLOCK_HEIGHT + 1.5, 0]}
          center
          style={{
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
            <div className="font-medium text-sm">{hoveredBlock.packageName}</div>
            <div className="text-xs text-muted-foreground">
              v{hoveredBlock.version}
            </div>
            <div className="text-xs mt-1">
              {hoveredBlock.vulnerabilityCount > 0 ? (
                <span className="text-destructive">
                  {hoveredBlock.vulnerabilityCount}개 취약점
                </span>
              ) : (
                <span className="text-green-600">안전</span>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
