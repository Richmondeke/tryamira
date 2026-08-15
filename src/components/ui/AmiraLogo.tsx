import React from 'react';

interface AmiraLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AmiraLogo({ size = 30, className, style }: AmiraLogoProps) {
  const width = Math.round(size * 4.8);
  return (
    <img
      src="/amira-logo.svg"
      alt="Amira Logo"
      width={width}
      height={size}
      className={className}
      style={{
        height: size,
        width: 'auto',
        objectFit: 'contain',
        ...style,
      }}
    />
  );
}
