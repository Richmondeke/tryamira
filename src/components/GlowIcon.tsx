"use client";

import React from "react";

interface GlowIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function GlowIcon({ name, size = 22, color, style, className }: GlowIconProps) {
  const iconColor = color || "currentColor";

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: iconColor,
        maskImage: `url(/glow-icons/${name}.svg)`,
        WebkitMaskImage: `url(/glow-icons/${name}.svg)`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
