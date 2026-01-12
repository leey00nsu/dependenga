"use client";

import { useRef, useState, Suspense } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Edges, RoundedBox } from "@react-three/drei";
import type { Mesh } from "three";
import type { SeverityWithSafe } from "@/entities/vulnerability/model/types";

/**
 * 심각도별 색상 매핑 (component-v2 배지 톤)
 */
const SEVERITY_STYLES: Record<
  SeverityWithSafe,
  { base: string; edge: string; glow: string }
> = {
  critical: {
    base: "#D64545",
    edge: "#9C2A2A",
    glow: "#F07A7A",
  },
  high: {
    base: "#F08A24",
    edge: "#B66010",
    glow: "#F6B86C",
  },
  medium: {
    base: "#F2C94C",
    edge: "#B98812",
    glow: "#F8E08A",
  },
  low: {
    base: "#5BC77A",
    edge: "#2D8B50",
    glow: "#9BE4B1",
  },
  safe: {
    base: "#63A7E8",
    edge: "#2F6AAE",
    glow: "#9FCCF4",
  },
};

export interface JengaBlockProps {
  packageName: string;
  version: string;
  severity: SeverityWithSafe;
  vulnerabilityCount: number;
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions?: [number, number, number]; // [length, height, width]
  onHover?: (isHovered: boolean, data: BlockData) => void;
  onClick?: (data: BlockData) => void;
  isHighlighted?: boolean; // 패널에서 호버 시 하이라이트
}

export interface BlockData {
  packageName: string;
  version: string;
  severity: SeverityWithSafe;
  vulnerabilityCount: number;
  position?: [number, number, number]; // 툴팁 위치용
}

/**
 * 젠가 블록 컴포넌트
 * 둥근 모서리 + 나무 텍스처
 * Suspense로 텍스처 로딩 처리, 에러 시 fallback
 */
export function JengaBlock(props: JengaBlockProps) {
  return (
    <Suspense fallback={<JengaBlockFallback {...props} />}>
      <JengaBlockWithTexture {...props} />
    </Suspense>
  );
}

/**
 * 텍스처 없는 Fallback 블록 (로딩 중 또는 에러 시)
 */
function JengaBlockFallback({
  severity,
  position,
  rotation,
  dimensions = [3, 0.6, 1],
}: JengaBlockProps) {
  const { base, edge, glow } = SEVERITY_STYLES[severity];
  
  return (
    <RoundedBox
      args={dimensions}
      radius={0.05}
      smoothness={4}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={base}
        roughness={0.25}
        metalness={0}
        transmission={0.35}
        thickness={0.5}
        clearcoat={0.85}
        clearcoatRoughness={0.12}
        transparent
        opacity={0.78}
        emissive={glow}
        emissiveIntensity={0.18}
      />
      <Edges scale={1.02} color={edge} linewidth={2} />
    </RoundedBox>
  );
}

/**
 * 텍스처가 있는 젠가 블록 (useLoader 사용)
 */
function JengaBlockWithTexture({
  packageName,
  version,
  severity,
  vulnerabilityCount,
  position,
  rotation,
  dimensions = [3, 0.6, 1],
  onHover,
  onClick,
  isHighlighted = false,
}: JengaBlockProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const blockData: BlockData = {
    packageName,
    version,
    severity,
    vulnerabilityCount,
    position,
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(true, blockData);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    onHover?.(false, blockData);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.(blockData);
  };

  const { base, edge, glow } = SEVERITY_STYLES[severity];
  const isCritical = severity === "critical";
  const showHighlight = hovered || isHighlighted;

  return (
    <RoundedBox
      ref={meshRef}
      args={dimensions}
      radius={0.05} // 둥근 모서리 반경
      smoothness={4} // 부드러움 (세그먼트 수)
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={showHighlight ? 1.05 : 1}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={base}
        emissive={isCritical ? glow : showHighlight ? glow : "#000000"}
        emissiveIntensity={isCritical ? 0.32 : showHighlight ? 0.22 : 0.1}
        roughness={0.22}
        metalness={0}
        transmission={0.4}
        thickness={0.55}
        clearcoat={0.85}
        clearcoatRoughness={0.14}
        transparent
        opacity={0.8}
      />
      <Edges scale={1.02} color={edge} linewidth={2} />
    </RoundedBox>
  );
}
