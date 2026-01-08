"use client";

import { CubeVisual } from "@/shared/ui/cube-visual";

interface LoadingAnimationProps {
  message?: string;
  subMessage?: string;
}

/**
 * 로딩 애니메이션 컴포넌트
 * 
 * dotLottie 애니메이션을 표시합니다.
 * `public/animations/loading.lottie`에 dotLottie 파일을 추가하면 자동으로 표시됩니다.
 * 파일 로딩 실패 시 CSS fallback 애니메이션을 표시합니다.
 * 
 * @example
 * // 1. LottieFiles에서 .lottie 파일 다운로드
 * // 2. public/animations/loading.lottie로 저장
 * // 3. 자동으로 로딩 화면에 표시됨!
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
