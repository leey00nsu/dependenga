"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { PackageVulnerability } from "@/entities/vulnerability/model/types";
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
  // 카메라 거리 계산 (패키지 수에 따라 동적 조정)
  const towerHeight = Math.ceil(packages.length / 3);
  const blockHeight = 0.6;
  const actualTowerHeight = towerHeight * blockHeight;
  
  // 타워가 높을수록 더 멀리, 더 높은 각도에서 봄
  const cameraDistance = Math.max(12, actualTowerHeight * 1.2);
  const cameraY = Math.max(8, actualTowerHeight * 0.8);
  
  // 카메라 타겟: 타워 중심 (높이의 40% 지점)
  const targetY = actualTowerHeight * 0.4;
  
  // 줌 범위: 타워 높이에 따라 동적 조정
  const minDistance = 5;
  const maxDistance = Math.max(80, actualTowerHeight * 3);

  return (
    <div className="w-full h-full min-h-[500px]" style={{ backgroundColor: "#E8F5E9" }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#E8F5E9");
        }}
      >
        <color attach="background" args={["#E8F5E9"]} />
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

          {/* 젠가 타워 - Floating */}
          <JengaTower 
            packages={packages} 
            onBlockHover={onBlockHover}
            onBlockClick={onBlockClick}
            highlightedPackage={highlightedPackage}
          />

          {/* 투명 그림자 바닥 - 그림자만 보이고 바닥 자체는 투명 */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -0.5, 0]} 
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
