"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lottie를 동적으로 로드 (SSR 비활성화)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Lottie JSON 파일 경로 (public 폴더에 저장)
// 사용자가 직접 애니메이션 파일을 추가하면 됩니다
let animationData: object | null = null;

try {
  // public/animations/loading.json 파일 시도
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  animationData = require("@/../public/animations/loading.json");
} catch {
  // 파일이 없으면 null로 유지
  animationData = null;
}

interface LoadingAnimationProps {
  message?: string;
  subMessage?: string;
}

/**
 * 로딩 애니메이션 컴포넌트
 * 
 * Lottie 애니메이션을 표시합니다.
 * `public/animations/loading.json`에 Lottie JSON 파일을 추가하면 자동으로 표시됩니다.
 * 파일이 없으면 기본 CSS 애니메이션을 표시합니다.
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
        {/* Lottie 애니메이션 또는 Fallback */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <Suspense fallback={<FallbackAnimation />}>
            {animationData ? (
              <div className="w-48 h-48">
                <Lottie 
                  animationData={animationData} 
                  loop={true}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : (
              <FallbackAnimation />
            )}
          </Suspense>
        </div>
        
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-sm text-gray-400 mt-1">{subMessage}</p>
      </div>
    </div>
  );
}

/**
 * Lottie 파일이 없을 때 표시되는 기본 CSS 애니메이션
 */
function FallbackAnimation() {
  return (
    <>
      {/* 간단한 블록 쌓기 CSS 애니메이션 */}
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
    </>
  );
}
