import React from 'react';

interface AmiraLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AmiraLogo({ size = 40, className, style }: AmiraLogoProps) {
  const width = size * 2.8;
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 140 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Amira logo"
    >
      <text
        x="0"
        y="38"
        fontFamily="'Satoshi', sans-serif"
        fontWeight="700"
        fontSize="42"
        fill="currentColor"
        letterSpacing="-1"
      >
        amira
      </text>
    </svg>
  );
}
