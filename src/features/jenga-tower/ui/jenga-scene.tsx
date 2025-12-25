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
  // 카메라 거리 계산 (패키지 수에 따라)
  const towerHeight = Math.ceil(packages.length / 3);
  const cameraDistance = Math.max(10, towerHeight * 2);

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
          {/* 카메라 */}
          <PerspectiveCamera
            makeDefault
            position={[cameraDistance, cameraDistance * 0.6, cameraDistance]}
            fov={45}
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

          {/* 카메라 컨트롤 */}
          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={50}
            target={[0, towerHeight * 0.3, 0]}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
