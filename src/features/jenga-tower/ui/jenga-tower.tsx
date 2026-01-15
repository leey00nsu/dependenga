"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
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
const DROP_HEIGHT = 8;
const ZERO_VECTOR: [number, number, number] = [0, 0, 0];
const MAX_COLLAPSE_TARGETS = 2;

const SEVERITY_RANK = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  safe: 0,
};

const PHYSICS_BY_SEVERITY = {
  critical: { friction: 0.2, linearDamping: 0.2, angularDamping: 0.25, restitution: 0.08 },
  high: { friction: 0.3, linearDamping: 0.25, angularDamping: 0.35, restitution: 0.06 },
  medium: { friction: 0.45, linearDamping: 0.35, angularDamping: 0.5, restitution: 0.05 },
  low: { friction: 0.6, linearDamping: 0.45, angularDamping: 0.6, restitution: 0.04 },
  safe: { friction: 0.9, linearDamping: 0.6, angularDamping: 0.8, restitution: 0.05 },
};

const IMPULSE_BY_SEVERITY = {
  critical: { impulse: 4.5, torque: 3.0 },
  high: { impulse: 3.6, torque: 2.4 },
  medium: { impulse: 2.4, torque: 1.6 },
  low: { impulse: 1.6, torque: 1.0 },
  safe: { impulse: 0, torque: 0 },
};

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
  const bodiesRef = useRef<Map<string, RapierRigidBody>>(new Map());
  const bodyHandlesRef = useRef<Map<string, number>>(new Map());
  const settledRef = useRef(false);
  const collapseTriggeredRef = useRef(false);
  const spawnTimersRef = useRef<number[]>([]);
  const { rigidBodyStates } = useRapier();

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
  const collapseTargets = useMemo(() => {
    const candidates = layout.blocks.filter(
      (block) => block.package && block.package.maxSeverity !== "safe"
    );
    candidates.sort((a, b) => {
      const severityDiff =
        SEVERITY_RANK[b.package?.maxSeverity ?? "safe"] -
        SEVERITY_RANK[a.package?.maxSeverity ?? "safe"];
      if (severityDiff !== 0) {
        return severityDiff;
      }
      return a.layer - b.layer;
    });

    return candidates.slice(0, MAX_COLLAPSE_TARGETS);
  }, [layout.blocks]);
  const hasVulnerableBlocks = collapseTargets.length > 0;

  const triggerCollapse = useCallback(() => {
    collapseTargets.forEach((block) => {
      if (!block.package || block.package.maxSeverity === "safe") {
        return;
      }

      const body = bodiesRef.current.get(block.id);
      if (!body) {
        return;
      }

      const { impulse, torque } = IMPULSE_BY_SEVERITY[block.package.maxSeverity];
      if (impulse === 0 && torque === 0) {
        return;
      }

      const direction = (block.layer + block.slot) % 2 === 0 ? 1 : -1;
      const upward = impulse * 0.3;
      const isRotated = Math.abs(block.rotation[1]) > 0.1;

      const impulseVector: [number, number, number] = isRotated
        ? [direction * impulse, upward, 0]
        : [0, upward, direction * impulse];
      const torqueVector: [number, number, number] = [0, torque * direction, torque * 0.3];

      body.wakeUp();
      body.applyImpulse(impulseVector, true);
      body.applyTorqueImpulse(torqueVector, true);
    });
  }, [collapseTargets]);

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
    clearSpawnTimers();
    bodiesRef.current.clear();
    bodyHandlesRef.current.clear();
    settledRef.current = false;
    collapseTriggeredRef.current = false;
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
    for (const handle of bodyHandlesRef.current.values()) {
      const state = rigidBodyStates.get(handle);
      if (!state || !state.isSleeping) {
        allSleeping = false;
        break;
      }
    }

    if (allSleeping) {
      if (hasVulnerableBlocks) {
        if (!collapseTriggeredRef.current) {
          collapseTriggeredRef.current = true;
          triggerCollapse();
          return;
        }

        if (!settledRef.current) {
          settledRef.current = true;
          onSettledChange?.(true);
        }
        return;
      }

      if (!settledRef.current) {
        settledRef.current = true;
        onSettledChange?.(true);
      }
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
      tooltipData = {
        packageName: block.package.packageName,
        version: block.package.version,
        vulnerabilityCount: block.package.vulnerabilities.length,
        position: block.position,
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
                bodyHandlesRef.current.set(block.id, api.handle);
              } else {
                bodiesRef.current.delete(block.id);
                bodyHandlesRef.current.delete(block.id);
              }
            }}
            position={spawnPositions[index]}
            rotation={block.rotation}
            colliders="cuboid"
            friction={PHYSICS_BY_SEVERITY[pkg?.maxSeverity ?? "safe"].friction}
            restitution={PHYSICS_BY_SEVERITY[pkg?.maxSeverity ?? "safe"].restitution}
            linearDamping={PHYSICS_BY_SEVERITY[pkg?.maxSeverity ?? "safe"].linearDamping}
            angularDamping={PHYSICS_BY_SEVERITY[pkg?.maxSeverity ?? "safe"].angularDamping}
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
