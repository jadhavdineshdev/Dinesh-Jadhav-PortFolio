"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = shouldReduceMotion
    ? { stiffness: 2000, damping: 80, mass: 0.1 }
    : { stiffness: 620, damping: 34, mass: 0.28 }

  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")

    const updateDevice = () => {
      setEnabled(finePointer.matches)
    }

    updateDevice()
    finePointer.addEventListener("change", updateDevice)
    return () => finePointer.removeEventListener("change", updateDevice)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      if (!visible) setVisible(true)

      const target = event.target as Element | null
      const isInteractive = Boolean(
        target?.closest("a, button, [role='button'], summary, input, textarea, select")
      )
      setHovered(isInteractive)
    }

    const onPointerDown = () => setPressed(true)
    const onPointerUp = () => setPressed(false)
    const onPointerLeave = () => setVisible(false)
    const onPointerEnter = () => setVisible(true)

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerdown", onPointerDown, { passive: true })
    window.addEventListener("pointerup", onPointerUp, { passive: true })
    document.documentElement.addEventListener("mouseleave", onPointerLeave)
    document.documentElement.addEventListener("mouseenter", onPointerEnter)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointerup", onPointerUp)
      document.documentElement.removeEventListener("mouseleave", onPointerLeave)
      document.documentElement.removeEventListener("mouseenter", onPointerEnter)
    }
  }, [enabled, mouseX, mouseY, visible])

  if (!enabled) return null

  const scale = pressed ? 0.78 : hovered ? 2.2 : 1

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        opacity: visible ? 1 : 0,
        scale,
      }}
      className={`nk-cursor-dot ${hovered ? "is-hovered" : ""}`}
      initial={{ opacity: 0, scale: 0.6 }}
      style={{
        x: cursorX,
        y: cursorY,
      }}
      transition={{
        opacity: { duration: 0.15 },
        scale: { type: "spring", stiffness: 520, damping: 28 },
      }}
    />
  )
}
