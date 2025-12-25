"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LoadingAnimationProps {
  message?: string;
  subMessage?: string;
}

/**
 * 로딩 애니메이션 컴포넌트
 * 
 * dotLottie 애니메이션을 표시합니다.
 * `public/animations/loading.lottie`에 dotLottie 파일을 추가하면 자동으로 표시됩니다.
 * 파일이 없으면 기본 CSS 애니메이션을 표시합니다.
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
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#E8F5E9" }}
    >
      <div className="text-center animate-in fade-in duration-300">
        {/* dotLottie 애니메이션 */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="w-48 h-48">
            <DotLottieReact
              src="/animations/loading.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
              renderConfig={{ autoResize: true }}
            />
          </div>
        </div>
        
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-sm text-gray-400 mt-1">{subMessage}</p>
      </div>
    </div>
  );
}
