"use client";

import { cn } from "@/lib/utils";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { EASE_LINEAR } from "@/components/smoothui/lib/animation";

export interface InfiniteSliderProps {
  children: React.ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
  gap?: number;
  paused?: boolean;
  reverse?: boolean;
  speed?: number;
  speedOnHover?: number;
}

export default function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  paused = false,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const hasStarted = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      translation.set(0);
      return;
    }

    if (paused || currentSpeed <= 0) {
      return;
    }

    let controls:
      | {
          stop: () => void;
        }
      | undefined;
    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const cycleDuration = Math.abs(to - from) / currentSpeed;
    const start = hasStarted.current ? translation.get() : from;

    controls = animate(translation, [start, to], {
      duration: Math.abs(to - start) / currentSpeed,
      ease: EASE_LINEAR,
      onComplete: () => {
        translation.set(from);
        controls = animate(translation, [from, to], {
          duration: cycleDuration,
          ease: EASE_LINEAR,
          onRepeat: () => {
            translation.set(from);
          },
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0,
          repeatType: "loop",
        });
      },
    });

    hasStarted.current = true;
    return () => controls?.stop();
  }, [
    paused,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    direction,
    reverse,
    shouldReduceMotion,
  ]);

  const hoverProps =
    speedOnHover === undefined
      ? {}
      : {
          onHoverEnd: () => setCurrentSpeed(speed),
          onHoverStart: () => setCurrentSpeed(speedOnHover),
        };

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        ref={ref}
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          flexDirection: direction === "horizontal" ? "row" : "column",
          gap: `${gap}px`,
        }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
