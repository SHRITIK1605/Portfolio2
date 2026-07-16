"use client";

import { useId } from "react";

interface SparkleIconProps {
  className?: string;
  size?: number;
}

export default function SparkleIcon({
  className = "",
  size = 16,
}: SparkleIconProps) {
  const gradientId = useId();

  return (
    <svg
      className={`block shrink-0 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="4"
          y1="3"
          x2="21"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <path
        d="M12 4.5L13.2 9.8L18.5 11L13.2 12.2L12 17.5L10.8 12.2L5.5 11L10.8 9.8L12 4.5Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M18.25 5.25L18.85 7.15L20.75 7.75L18.85 8.35L18.25 10.25L17.65 8.35L15.75 7.75L17.65 7.15L18.25 5.25Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}
