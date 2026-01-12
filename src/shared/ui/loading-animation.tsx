"use client";

import Image from "next/image";

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
    <div className="min-h-screen v2-background flex items-center justify-center px-6 py-10">
      <div className="v2-panel w-full max-w-xl rounded-3xl px-8 py-10 text-center animate-in fade-in duration-300">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="relative h-[min(32vw,32vh)] w-[min(32vw,32vh)] max-h-[260px] max-w-[260px] sm:max-h-[300px] sm:max-w-[300px]">
            <Image
              src="/images/landing-image.png"
              alt="Dependenga 로고 이미지"
              fill
              className="object-contain drop-shadow-[0_18px_30px_rgba(90,150,185,0.35)]"
              priority
            />
          </div>
        </div>

        <p className="text-slate-600 font-semibold">{message}</p>
        <p className="mt-1 text-sm text-slate-500">{subMessage}</p>
      </div>
    </div>
  );
}
