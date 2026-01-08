"use client";

import clsx from "clsx";
import { JSX } from "react";

interface CubeVisualProps {
  className?: string;
  idPrefix?: string;
  title?: string;
  scale?: number;
}

/**
 * cube.html 기반 3x3x3 아이소메트릭 큐브 비주얼
 */
export function CubeVisual({
  className,
  idPrefix = "cube",
  title,
  scale = 1,
}: CubeVisualProps) {
  const bounds = {
    minX: -80,
    minY: -120,
    width: 229.2,
    height: 272,
  };
  const centerX = bounds.minX + bounds.width / 2;
  const centerY = bounds.minY + bounds.height / 2;
  const scaleTransform =
    scale === 1
      ? undefined
      : `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
  const filterId = `${idPrefix}-glow`;
  const cubeId = `${idPrefix}-shape`;
  const colors = ["#f87171", "#fb923c", "#4ade80"];
  const cubes: JSX.Element[] = [];

  for (let k = 0; k < 3; k += 1) {
    for (let j = 0; j < 3; j += 1) {
      for (let i = 0; i < 3; i += 1) {
        const x = (i - j) * 40;
        const y = (i + j) * 23 - k * 50;
        cubes.push(
          <g
            key={`cube-${i}-${j}-${k}`}
            transform={`translate(${x} ${y})`}
            fill={colors[i]}
            stroke={colors[i]}
            strokeWidth={1}
            filter={`url(#${filterId})`}
          >
            <use href={`#${cubeId}`} />
          </g>
        );
      }
    }
  }

  return (
    <svg
      viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
      className={clsx("h-full w-full", className)}
      preserveAspectRatio="xMidYMid meet"
      {...(title
        ? { role: "img", "aria-label": title }
        : { "aria-hidden": true })}
    >
      {title && <title>{title}</title>}
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <g id={cubeId}>
          <path d="M 0 0 L 34.6 -20 L 69.2 0 L 34.6 20 Z" fillOpacity="0.6" />
          <path d="M 0 0 L 0 40 L 34.6 60 L 34.6 20 Z" fillOpacity="0.4" />
          <path
            d="M 34.6 20 L 34.6 60 L 69.2 40 L 69.2 0 Z"
            fillOpacity="0.5"
          />
        </g>
      </defs>

      <g transform={scaleTransform}>{cubes}</g>
    </svg>
  );
}
