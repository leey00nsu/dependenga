"use client";

import { useRef, useState, Suspense } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Edges, RoundedBox } from "@react-three/drei";
import type { Mesh } from "three";
import type { SeverityWithSafe } from "@/entities/vulnerability/model/types";

/**
 * 심각도별 색상 매핑 (디자인 가이드)
 * Safe: 웜 그레이, Severity: 명확한 대비 색상
 */
const SEVERITY_COLORS: Record<SeverityWithSafe, string> = {
  critical: "#E74C3C", // 선명한 레드
  high: "#F39C12",     // 주황
  medium: "#F1C40F",   // 옐로우
  low: "#2ECC71",      // 그린
  safe: "#BFC2C7",     // 웜 그레이
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
  const color = SEVERITY_COLORS[severity];
  
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
        color={color}
        roughness={0.15}
        metalness={0}
        transmission={0.65}
        thickness={0.6}
        clearcoat={0.6}
        clearcoatRoughness={0.2}
        transparent
        opacity={0.55}
        emissive={color}
        emissiveIntensity={0.12}
      />
      <Edges scale={1.02} color="#F8FAFC" linewidth={2} />
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

  const color = SEVERITY_COLORS[severity];
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
        color={color}
        emissive={isCritical ? color : (showHighlight ? color : "#000000")}
        emissiveIntensity={isCritical ? 0.35 : (showHighlight ? 0.22 : 0.08)}
        roughness={0.12}
        metalness={0}
        transmission={0.7}
        thickness={0.7}
        clearcoat={0.7}
        clearcoatRoughness={0.18}
        transparent
        opacity={0.6}
      />
      <Edges scale={1.02} color="#F8FAFC" linewidth={2} />
    </RoundedBox>
  );
}
