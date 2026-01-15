"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, type RigidBodyApi } from "@react-three/rapier";
import { JengaBlock, type BlockData } from "./jenga-block";
import type { JengaLayoutResult } from "../model/jenga-layout";
import { BLOCK_HEIGHT } from "../model/jenga-layout";

interface JengaTowerProps {
  layout: JengaLayoutResult;
  onBlockHover?: (data: BlockData | null) => void;
  onBlockClick?: (data: BlockData) => void;
  highlightedPackage?: string | null;
  onSettledChange?: (isSettled: boolean) => void;
}

const SPAWN_INTERVAL_MS = 120;
const DROP_HEIGHT = 5;
const ZERO_VECTOR: [number, number, number] = [0, 0, 0];

/**
 * 패키지 목록을 젠가 타워로 렌더링
 */
export function JengaTower({
  layout,
  onBlockHover,
  onBlockClick,
  highlightedPackage,
  onSettledChange,
}: JengaTowerProps) {
  const [hoveredBlock, setHoveredBlock] = useState<BlockData | null>(null);
  const [spawnCount, setSpawnCount] = useState(0);
  const bodiesRef = useRef<Map<string, RigidBodyApi>>(new Map());
  const packageBodiesRef = useRef<Map<string, RigidBodyApi>>(new Map());
  const settledRef = useRef(false);
  const lastLayoutKeyRef = useRef<string | null>(null);
  const spawnTimersRef = useRef<number[]>([]);

  const spawnPositions = useMemo(
    () =>
      layout.blocks.map(
        (block) =>
          [
            block.position[0],
            block.position[1] + DROP_HEIGHT,
            block.position[2],
          ] as [number, number, number]
      ),
    [layout.blocks]
  );

  const handleHover = useCallback(
    (isHovered: boolean, data: BlockData) => {
      const newHovered = isHovered ? data : null;
      setHoveredBlock(newHovered);
      onBlockHover?.(newHovered);
    },
    [onBlockHover]
  );

  const clearSpawnTimers = useCallback(() => {
    spawnTimersRef.current.forEach((timer) => clearTimeout(timer));
    spawnTimersRef.current = [];
  }, []);

  useEffect(() => {
    if (lastLayoutKeyRef.current === layout.key) {
      return;
    }
    lastLayoutKeyRef.current = layout.key;

    clearSpawnTimers();
    bodiesRef.current.clear();
    packageBodiesRef.current.clear();
    settledRef.current = false;
    setHoveredBlock(null);
    setSpawnCount(0);
    onSettledChange?.(false);

    if (layout.blocks.length === 0) {
      return;
    }

    const scheduleNext = (nextIndex: number) => {
      const delay = nextIndex === 1 ? 0 : SPAWN_INTERVAL_MS;
      const timer = window.setTimeout(() => {
        setSpawnCount(nextIndex);
        if (nextIndex < layout.blocks.length) {
          scheduleNext(nextIndex + 1);
        }
      }, delay);
      spawnTimersRef.current.push(timer);
    };

    scheduleNext(1);

    return () => {
      clearSpawnTimers();
    };
  }, [layout.blocks.length, layout.key, clearSpawnTimers, onSettledChange]);

  useFrame(() => {
    if (settledRef.current) {
      return;
    }

    if (spawnCount < layout.blocks.length) {
      return;
    }

    if (bodiesRef.current.size < layout.blocks.length) {
      return;
    }

    let allSleeping = true;
    for (const body of bodiesRef.current.values()) {
      if (!body.isSleeping()) {
        allSleeping = false;
        break;
      }
    }

    if (allSleeping) {
      settledRef.current = true;
      onSettledChange?.(true);
    }
  });

  const spawnedBlocks = layout.blocks.slice(0, spawnCount);

  let tooltipData:
    | {
        packageName: string;
        version: string;
        vulnerabilityCount: number;
        position?: [number, number, number];
      }
    | null = null;

  if (hoveredBlock && hoveredBlock.packageName !== "normal") {
    tooltipData = hoveredBlock;
  } else if (highlightedPackage) {
    const block = layout.blocks.find(
      (item) => item.package?.packageName === highlightedPackage
    );
    if (block?.package) {
      const body = packageBodiesRef.current.get(highlightedPackage);
      const position = body
        ? ([
            body.translation().x,
            body.translation().y,
            body.translation().z,
          ] as [number, number, number])
        : block.position;

      tooltipData = {
        packageName: block.package.packageName,
        version: block.package.version,
        vulnerabilityCount: block.package.vulnerabilities.length,
        position,
      };
    }
  }

  return (
    <group>
      {spawnedBlocks.map((block, index) => {
        const pkg = block.package;
        const isHighlighted = pkg?.packageName === highlightedPackage;

        return (
          <RigidBody
            key={block.id}
            ref={(api) => {
              if (api) {
                bodiesRef.current.set(block.id, api);
                if (pkg) {
                  packageBodiesRef.current.set(pkg.packageName, api);
                }
              } else {
                bodiesRef.current.delete(block.id);
                if (pkg) {
                  packageBodiesRef.current.delete(pkg.packageName);
                }
              }
            }}
            position={spawnPositions[index]}
            rotation={block.rotation}
            colliders="cuboid"
            friction={0.9}
            restitution={0.05}
            linearDamping={0.6}
            angularDamping={0.8}
            canSleep
          >
            <JengaBlock
              packageName={pkg?.packageName ?? "normal"}
              version={pkg?.version ?? ""}
              severity={pkg?.maxSeverity ?? "safe"}
              vulnerabilityCount={pkg?.vulnerabilities.length ?? 0}
              position={ZERO_VECTOR}
              rotation={ZERO_VECTOR}
              onHover={handleHover}
              onClick={onBlockClick}
              dimensions={block.dimensions}
              isHighlighted={isHighlighted}
            />
          </RigidBody>
        );
      })}

      {/* 호버 툴팁 - 3D 블록 호버 또는 패널 호버 시 블록 위치에 표시 */}
      {tooltipData && (
        <Html
          position={[
            tooltipData.position?.[0] ?? 0,
            (tooltipData.position?.[1] ?? 0) + BLOCK_HEIGHT + 0.5,
            tooltipData.position?.[2] ?? 0,
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
            <div className="text-xs text-gray-300">v{tooltipData.version}</div>
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
