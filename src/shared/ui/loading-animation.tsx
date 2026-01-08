"use client";

import { CubeVisual } from "@/shared/ui/cube-visual";

interface LoadingAnimationProps {
  message?: string;
  subMessage?: string;
}

/**
 * 로딩 애니메이션 컴포넌트
 *
 * cube.html 기반 큐브 모티프를 사용합니다.
 * 분석 로딩 화면에서 다크 톤과 일관된 비주얼을 제공합니다.
 */
export function LoadingAnimation({ 
  message = "Analyzing dependencies...", 
  subMessage = "Building your Jenga tower" 
}: LoadingAnimationProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#0b0f14]"
    >
      <div className="text-center animate-in fade-in duration-300">
        <div className="mb-4 flex flex-col items-center gap-3">
          <div className="h-[min(32vw,32vh)] w-[min(32vw,32vh)] max-h-[260px] max-w-[260px] sm:max-h-[300px] sm:max-w-[300px]">
            <CubeVisual
              className="cube-float drop-shadow-[0_0_45px_rgba(74,222,128,0.22)]"
              idPrefix="loading-cube"
              title="로딩 큐브"
            />
          </div>
        </div>
        
        <p className="text-white/70 font-medium">{message}</p>
        <p className="mt-1 text-sm text-white/40">{subMessage}</p>
      </div>
    </div>
  );
}
