"use client";

import { useState, useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";

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
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // dotLottie 인스턴스 콜백 - 이벤트 리스너 등록
  const dotLottieRefCallback = useCallback((dotLottie: DotLottie | null) => {
    if (!dotLottie) return;

    // 로드 완료 이벤트
    dotLottie.addEventListener("load", () => {
      setIsLoading(false);
    });

    // 에러 이벤트
    dotLottie.addEventListener("loadError", () => {
      setHasError(true);
      setIsLoading(false);
    });
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#E8F5E9" }}
    >
      <div className="text-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="w-48 h-48 flex items-center justify-center">
            {/* 로딩 중이거나 에러 시 CSS fallback 표시 */}
            {(isLoading || hasError) && <FallbackSpinner />}
            
            {/* dotLottie 애니메이션 */}
            {!hasError && (
              <div 
                className={`w-full h-full ${isLoading ? 'hidden' : ''}`}
              >
                <DotLottieReact
                  src="/animations/loading.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                  dotLottieRefCallback={dotLottieRefCallback}
                />
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-sm text-gray-400 mt-1">{subMessage}</p>
      </div>
    </div>
  );
}

/**
 * CSS Fallback 스피너
 * dotLottie 로딩 실패 또는 로딩 중일 때 표시
 */
function FallbackSpinner() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* 블록 쌓기 애니메이션 */}
      <div className="flex gap-1">
        <div className="w-8 h-3 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-8 h-3 bg-gray-400 rounded-sm animate-bounce" style={{ animationDelay: "100ms" }} />
        <div className="w-8 h-3 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "200ms" }} />
      </div>
      <div className="flex gap-1 -mt-1">
        <div className="w-3 h-8 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "300ms" }} />
        <div className="w-3 h-8 bg-gray-400 rounded-sm animate-bounce" style={{ animationDelay: "400ms" }} />
        <div className="w-3 h-8 bg-gray-300 rounded-sm animate-bounce" style={{ animationDelay: "500ms" }} />
      </div>
    </div>
  );
}
