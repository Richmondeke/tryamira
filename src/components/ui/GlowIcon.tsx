import React from 'react';

interface GlowIconProps {
  name: string; // e.g. "home-outline", "calendar-outline", "zap-outline"
  variant?: 'Outline' | 'Solid';
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function GlowIcon({
  name,
  variant = 'Outline',
  size = 18,
  color,
  className,
  style,
}: GlowIconProps) {
  const iconPath = `/glow-icons/${variant}/${name}.svg`;

  let computedFilter = 'brightness(0) invert(0.75)'; // Default crisp visible light-gray for dark background
  if (color === '#ffffff' || color === 'white') {
    computedFilter = 'brightness(0) invert(1)'; // Pure 100% white
  } else if (color === '#1b5a92') {
    computedFilter = 'invert(37%) sepia(85%) saturate(3475%) hue-rotate(244deg) brightness(101%) contrast(103%)'; // Amira purple
  } else if (color === '#10b981') {
    computedFilter = 'invert(58%) sepia(85%) saturate(460%) hue-rotate(114deg) brightness(98%) contrast(93%)'; // Success green
  } else if (color === '#64748b') {
    computedFilter = 'invert(46%) sepia(10%) saturate(700%) hue-rotate(182deg) brightness(92%) contrast(88%)'; // Slate gray (V3 light sidebar inactive)
  } else if (color === '#94a3b8' || color === '#9299ab') {
    computedFilter = 'invert(68%) sepia(8%) saturate(500%) hue-rotate(182deg) brightness(93%) contrast(89%)'; // Muted gray (V2 dark sidebar inactive)
  } else if (color === '#0f172a') {
    computedFilter = 'brightness(0) invert(0.06)'; // Near-black (dark text on light bg)
  } else if (color === '#3b82f6') {
    computedFilter = 'invert(45%) sepia(90%) saturate(2200%) hue-rotate(205deg) brightness(100%) contrast(96%)'; // Blue
  } else if (color === '#f97316') {
    computedFilter = 'invert(55%) sepia(85%) saturate(2800%) hue-rotate(355deg) brightness(100%) contrast(96%)'; // Orange
  } else if (color === '#ec4899') {
    computedFilter = 'invert(48%) sepia(80%) saturate(3000%) hue-rotate(305deg) brightness(98%) contrast(95%)'; // Pink
  } else if (color === '#f59e0b') {
    computedFilter = 'invert(65%) sepia(90%) saturate(2000%) hue-rotate(15deg) brightness(98%) contrast(95%)'; // Yellow
  } else if (color === '#ef4444') {
    computedFilter = 'invert(40%) sepia(95%) saturate(3000%) hue-rotate(345deg) brightness(98%) contrast(95%)'; // Red
  } else if (color) {
    computedFilter = 'brightness(0) invert(0.75)';
  }

  return (
    <img
      src={iconPath}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: computedFilter,
        ...style,
      }}
    />
  );
}
