"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  /** How far the glow spreads (px). Default 40 */
  spread?: number;
  /** Glow colour — hsl string, hex, or CSS colour. Default uses HZLR forest-teal */
  glowColor?: string;
  /** Whether to show the persistent border glow even without pointer. Default true */
  glow?: boolean;
  /** Pointer must be within this many px of the element to trigger. Default 64 */
  proximity?: number;
  /** 0–1 fraction of the element's radius that is always un-glowed in the centre. Default 0.01 */
  inactiveZone?: number;
  /** Width of the glowing border (px). Default 2 */
  borderWidth?: number;
  /** Disable the effect entirely. Default false */
  disabled?: boolean;
  /** Extra class on the outer wrapper */
  className?: string;
}

export function GlowingEffect({
  spread = 40,
  glowColor = "hsl(158 55% 35%)",
  glow = true,
  proximity = 64,
  inactiveZone = 0.01,
  borderWidth = 2,
  disabled = false,
  className,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed position for a buttery follow
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  const opacity  = useMotionValue(glow ? 0.6 : 0);
  const radius   = useMotionValue(spread);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${springX}px ${springY}px, ${glowColor}, transparent 85%)`;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (disabled || !containerRef.current) return;
      const rect  = containerRef.current.getBoundingClientRect();
      const elCx  = rect.left + rect.width  / 2;
      const elCy  = rect.top  + rect.height / 2;
      const dist  = Math.hypot(e.clientX - elCx, e.clientY - elCy);
      const maxR  = Math.max(rect.width, rect.height) / 2;
      const inZone = dist < maxR * inactiveZone;

      // Local coords
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;

      // Distance from element edge
      const nearDist = Math.max(
        0,
        dist - maxR
      );

      if (nearDist < proximity && !inZone) {
        mouseX.set(lx);
        mouseY.set(ly);
        animate(opacity, 1, { duration: 0.2 });
        animate(radius, spread, { duration: 0.2 });
      } else {
        animate(opacity, glow ? 0.45 : 0, { duration: 0.4 });
      }
    },
    [disabled, glow, inactiveZone, proximity, spread, mouseX, mouseY, opacity, radius]
  );

  const handleMouseLeave = useCallback(() => {
    animate(opacity, glow ? 0.45 : 0, { duration: 0.5 });
  }, [glow, opacity]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || disabled) return;

    // Listen on document so proximity detection works
    document.addEventListener("mousemove",  handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove",  handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled, handleMouseMove, handleMouseLeave]);

  if (disabled) return null;

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit] z-0", className)}
      style={{
        // The glowing border is painted as a box-shadow / background on the pseudo-layer
      }}
    >
      {/* Outer border glow */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `var(--glow-bg, transparent)`,
          padding: borderWidth,
          WebkitMaskImage: "linear-gradient(black,black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
      {/* Animated glow overlay — rendered via inline style so framer values apply */}
      <_GlowLayer
        background={background}
        opacity={opacity}
        borderWidth={borderWidth}
      />
    </div>
  );
}

// Inner component so we can use motion values without extra deps
import { motion } from "framer-motion";
import type { MotionValue } from "framer-motion";

function _GlowLayer({
  background,
  opacity,
  borderWidth,
}: {
  background: MotionValue<string>;
  opacity: MotionValue<number>;
  borderWidth: number;
}) {
  return (
    <motion.div
      className="absolute rounded-[inherit]"
      style={{
        inset: -borderWidth,
        background,
        opacity,
        zIndex: 0,
      }}
    />
  );
}
