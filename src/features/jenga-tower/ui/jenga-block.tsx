"use client";

import { useRef, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import type { Mesh } from "three";
import type { SeverityWithSafe } from "@/entities/vulnerability/model/types";

/**
 * 심각도별 색상 매핑 (파스텔 톤)
 */
const SEVERITY_COLORS: Record<SeverityWithSafe, string> = {
  critical: "#f8a5a5", // 파스텔 레드
  high: "#fbc79a",     // 파스텔 오렌지
  medium: "#fce588",   // 파스텔 옐로우
  low: "#b8e6b8",      // 파스텔 라임
  safe: "#a8e6cf",     // 파스텔 민트
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
}

export interface BlockData {
  packageName: string;
  version: string;
  severity: SeverityWithSafe;
  vulnerabilityCount: number;
}

/**
 * 젠가 블록 컴포넌트
 */
export function JengaBlock({
  packageName,
  version,
  severity,
  vulnerabilityCount,
  position,
  rotation,
  dimensions = [3, 0.6, 1], // 기본값: 길이 3, 높이 0.6, 폭 1
  onHover,
  onClick,
}: JengaBlockProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const blockData: BlockData = {
    packageName,
    version,
    severity,
    vulnerabilityCount,
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

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={hovered ? 1.03 : 1}
      castShadow
      receiveShadow
    >
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : "#000000"}
        emissiveIntensity={hovered ? 0.2 : 0}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}
