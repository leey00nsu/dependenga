"use client";

import { useRef, useState, Suspense } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Edges, Outlines, RoundedBox } from "@react-three/drei";
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
    base: "#F6A3A3",
    edge: "#7A1E1E",
    glow: "#FFFFFF",
  },
  high: {
    base: "#F8C38C",
    edge: "#8B4A0D",
    glow: "#FFFFFF",
  },
  medium: {
    base: "#FAE3A0",
    edge: "#8F6B0F",
    glow: "#FFFFFF",
  },
  low: {
    base: "#A7E3B8",
    edge: "#1E6B3D",
    glow: "#FFFFFF",
  },
  safe: {
    base: "#A9D2F6",
    edge: "#1F4F82",
    glow: "#FFFFFF",
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
      radius={0.2}
      smoothness={12}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={base}
        roughness={0.32}
        metalness={0}
        transmission={0.78}
        thickness={0.9}
        ior={1.35}
        clearcoat={1}
        clearcoatRoughness={0.18}
        specularIntensity={1}
        specularColor="#ffffff"
        attenuationColor={base}
        attenuationDistance={0.6}
        emissive={glow}
        emissiveIntensity={0.1}
        transparent
        opacity={0.82}
      />
      <Outlines
        thickness={0.1}
        color={edge}
        opacity={1}
        transparent={false}
        screenspace
      />
      <Edges scale={1.01} color={edge} linewidth={1.5} />
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
      radius={0.2} // 둥근 모서리 반경
      smoothness={12} // 부드러움 (세그먼트 수)
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={showHighlight ? 1.04 : 1}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={base}
        roughness={0.32}
        metalness={0}
        transmission={0.8}
        thickness={0.95}
        ior={1.35}
        clearcoat={1}
        clearcoatRoughness={0.18}
        specularIntensity={1}
        specularColor="#ffffff"
        attenuationColor={base}
        attenuationDistance={0.6}
        emissive={isCritical ? glow : showHighlight ? glow : "#000000"}
        emissiveIntensity={isCritical ? 0.14 : showHighlight ? 0.12 : 0}
        transparent
        opacity={0.84}
      />
      <Outlines
        thickness={showHighlight ? 0.12 : 0.1}
        color={edge}
        opacity={1}
        transparent={false}
        screenspace
      />
      <Edges scale={1.01} color={edge} linewidth={1.5} />
    </RoundedBox>
  );
}
