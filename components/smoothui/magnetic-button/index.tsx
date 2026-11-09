"use client"

import { motion, useReducedMotion, useSpring } from "motion/react"
import type { CSSProperties, MouseEventHandler, PointerEvent, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export type MagneticButtonProps = {
  children: ReactNode
  strength?: number
  radius?: number
  springConfig?: { stiffness?: number; damping?: number }
  href: string
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  rel?: string
  style?: CSSProperties
  target?: string
  "aria-label"?: string
}

export default function MagneticButton({
  children,
  className,
  href,
  radius = 140,
  springConfig = { stiffness: 300, damping: 24 },
  strength = 0.18,
  style,
  ...props
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion()
  const [hasFinePointer, setHasFinePointer] = useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const updatePointer = () => setHasFinePointer(query.matches)
    updatePointer()
    query.addEventListener("change", updatePointer)
    return () => query.removeEventListener("change", updatePointer)
  }, [])

  function moveWithPointer(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !hasFinePointer || event.pointerType !== "mouse" || !linkRef.current) {
      return
    }

    const bounds = linkRef.current.getBoundingClientRect()
    const offsetX = event.clientX - (bounds.left + bounds.width / 2)
    const offsetY = event.clientY - (bounds.top + bounds.height / 2)
    const distance = Math.hypot(offsetX, offsetY)

    if (distance < radius) {
      const strengthAtDistance = strength * (1 - distance / radius)
      x.set(offsetX * strengthAtDistance)
      y.set(offsetY * strengthAtDistance)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  function resetMagnet() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      className="magnetic-button-field"
      onPointerLeave={resetMagnet}
      onPointerMove={moveWithPointer}
    >
      <motion.a
        {...props}
        ref={linkRef}
        className={cn("magnetic-button", className)}
        href={href}
        style={{ ...style, x, y }}
      >
        {children}
      </motion.a>
    </div>
  )
}
