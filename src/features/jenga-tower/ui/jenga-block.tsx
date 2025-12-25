"use client";

import { useRef, useState, useMemo } from "react";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { TextureLoader, RepeatWrapping } from "three";
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

// 나무 텍스처 URL
const WOOD_TEXTURE_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg";

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
  isHighlighted = false,
}: JengaBlockProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // 나무 텍스처 로드
  const woodTexture = useLoader(TextureLoader, WOOD_TEXTURE_URL);
  
  // 텍스처 설정
  const texture = useMemo(() => {
    const tex = woodTexture.clone();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(0.5, 0.3);
    return tex;
  }, [woodTexture]);

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
      <meshStandardMaterial
        color={color}
        bumpMap={texture}
        bumpScale={2}
        emissive={isCritical ? "#ff6666" : (showHighlight ? color : "#000000")}
        emissiveIntensity={isCritical ? 0.3 : (showHighlight ? 0.25 : 0)}
        roughness={0.6}
        metalness={0.02}
      />
    </RoundedBox>
  );
}
