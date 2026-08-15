"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  reverse?: boolean;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 45,
  duration = 0.8,
  reverse = true,
  threshold = 0.08,
  className = "",
  style = {},
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else if (reverse) {
            // Reverse animation when element leaves the viewport
            setIsVisible(false);
          }
        },
        {
          threshold,
          rootMargin: "0px 0px -30px 0px",
        }
      );

      observer.observe(el);

      return () => {
        if (el) observer.unobserve(el);
      };
    } else {
      setIsVisible(true);
    }
  }, [reverse, threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "none":
        return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay / 1000}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay / 1000}s`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
