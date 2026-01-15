"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import type { PackageVulnerability } from "@/entities/vulnerability/model/types";
import {
  buildJengaLayout,
  createJengaLayoutKey,
  BLOCK_HEIGHT,
  BLOCK_LENGTH,
  BLOCK_WIDTH,
} from "../model/jenga-layout";
import { JengaTower } from "./jenga-tower";
import type { BlockData } from "./jenga-block";

interface JengaSceneProps {
  packages: PackageVulnerability[];
  onBlockHover?: (data: BlockData | null) => void;
  onBlockClick?: (data: BlockData) => void;
  highlightedPackage?: string | null;
}

/**
 * 3D 젠가 씬 컴포넌트
 * Minimal, playful, modern 디자인
 * 단색 배경, floating 젠가, 부드러운 그림자
 */
export function JengaScene({ 
  packages, 
  onBlockHover,
  onBlockClick,
  highlightedPackage 
}: JengaSceneProps) {
  const layoutKey = useMemo(() => createJengaLayoutKey(packages), [packages]);
  const layout = useMemo(() => buildJengaLayout(packages), [layoutKey]);
  const [isPhysicsPaused, setIsPhysicsPaused] = useState(false);

  useEffect(() => {
    setIsPhysicsPaused(false);
  }, [layout.key]);

  // 카메라 거리 계산 (패키지 수에 따라 동적 조정)
  const actualTowerHeight = layout.towerHeight;
  
  // 타워가 높을수록 더 멀리, 더 높은 각도에서 봄
  const cameraDistance = Math.max(12, actualTowerHeight * 1.2);
  const cameraY = Math.max(8, actualTowerHeight * 0.8);
  
  // 카메라 타겟: 타워 중심 (높이의 40% 지점)
  const targetY = actualTowerHeight * 0.4;
  
  // 줌 범위: 타워 높이에 따라 동적 조정
  const minDistance = 5;
  const maxDistance = Math.max(80, actualTowerHeight * 3);
  const groundY = -BLOCK_HEIGHT / 2;
  const shadowPlaneY = groundY - 0.2;
  const wallDistance = Math.max(BLOCK_LENGTH * 2, BLOCK_WIDTH * 6);
  const wallThickness = 0.2;
  const wallHeight = Math.max(actualTowerHeight + 2, 6);
  const wallCenterY = wallHeight / 2;
  const wallLength = wallDistance * 2;

  return (
    <div className="w-full h-full min-h-[500px] bg-transparent">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {/* 카메라 - 타워 높이에 따라 자동 조정 */}
          <PerspectiveCamera
            makeDefault
            position={[cameraDistance, cameraY, cameraDistance]}
            fov={50}
          />

          {/* 조명 - Soft studio lighting */}
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight
            position={[10, 15, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0001}
            color="#fffaf0"
          />
          <directionalLight position={[-5, 8, -5]} intensity={0.3} color="#e0f0ff" />

          {/* 젠가 타워 - Physics */}
          <Physics paused={isPhysicsPaused} gravity={[0, -9.81, 0]} updatePriority={-1}>
            <RigidBody type="fixed" colliders={false} position={[0, groundY, 0]}>
              <CuboidCollider args={[50, 0.1, 50]} />
              <CuboidCollider
                args={[wallLength / 2, wallHeight / 2, wallThickness / 2]}
                position={[0, wallCenterY, -wallDistance]}
              />
              <CuboidCollider
                args={[wallLength / 2, wallHeight / 2, wallThickness / 2]}
                position={[0, wallCenterY, wallDistance]}
              />
              <CuboidCollider
                args={[wallThickness / 2, wallHeight / 2, wallLength / 2]}
                position={[-wallDistance, wallCenterY, 0]}
              />
              <CuboidCollider
                args={[wallThickness / 2, wallHeight / 2, wallLength / 2]}
                position={[wallDistance, wallCenterY, 0]}
              />
            </RigidBody>
            <JengaTower 
              layout={layout}
              onBlockHover={onBlockHover}
              onBlockClick={onBlockClick}
              highlightedPackage={highlightedPackage}
              onSettledChange={setIsPhysicsPaused}
            />
          </Physics>

          {/* 투명 그림자 바닥 - 그림자만 보이고 바닥 자체는 투명 */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, shadowPlaneY, 0]} 
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <shadowMaterial transparent opacity={0.3} />
          </mesh>

          {/* 카메라 컨트롤 - 줌, 회전, 패닝 가능 */}
          <OrbitControls
            enablePan={true}
            minDistance={minDistance}
            maxDistance={maxDistance}
            target={[0, targetY, 0]}
            autoRotate={false}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
