"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import type { PackageVulnerability } from "@/entities/vulnerability/model/types";
import { JengaTower } from "./jenga-tower";
import type { BlockData } from "./jenga-block";

interface JengaSceneProps {
  packages: PackageVulnerability[];
  onBlockClick?: (data: BlockData) => void;
}

/**
 * 3D 젠가 씬 컴포넌트
 * Canvas, 카메라, 조명, 컨트롤 설정
 * 스튜디오 스타일 흰색 배경
 */
export function JengaScene({ packages, onBlockClick }: JengaSceneProps) {
  // 카메라 거리 계산 (패키지 수에 따라)
  const towerHeight = Math.ceil(packages.length / 3);
  const cameraDistance = Math.max(10, towerHeight * 2);

  return (
    <div className="w-full h-[700px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <Canvas
        shadows
        style={{ background: "linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)" }}
      >
        <Suspense fallback={null}>
          {/* 카메라 */}
          <PerspectiveCamera
            makeDefault
            position={[cameraDistance, cameraDistance * 0.7, cameraDistance]}
            fov={50}
          />

          {/* 안개 효과로 스튜디오 느낌 */}
          <fog attach="fog" args={["#f0f0f0", 20, 60]} />

          {/* 조명 - 부드러운 스튜디오 조명 */}
          <ambientLight intensity={0.8} color="#ffffff" />
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
          <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#e0f0ff" />
          <pointLight position={[0, 10, 0]} intensity={0.4} color="#ffffff" />

          {/* 젠가 타워 */}
          <JengaTower packages={packages} onBlockClick={onBlockClick} />

          {/* 바닥 - 원형 스튜디오 스타일 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
            <circleGeometry args={[15, 64]} />
            <meshStandardMaterial 
              color="#fafafa" 
              roughness={0.8}
              metalness={0}
            />
          </mesh>

          {/* 컨택트 섀도우 - 부드러운 그림자 */}
          <ContactShadows
            position={[0, -0.29, 0]}
            opacity={0.4}
            scale={30}
            blur={2}
            far={10}
            color="#555555"
          />

          {/* 카메라 컨트롤 */}
          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={50}
            target={[0, towerHeight / 2, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

