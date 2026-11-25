"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"

function RevealWord({
  word,
  accent,
  progress,
  range,
}: {
  word: string
  accent?: boolean
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.18, 1])

  return (
    <motion.span
      className={accent ? "ns-reveal-word is-accent" : "ns-reveal-word"}
      style={{ opacity }}
    >
      {word}{" "}
    </motion.span>
  )
}

export function NikaScrollReveal({
  text,
  accentWords = [],
}: {
  text: string
  accentWords?: string[]
}) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 42%"],
  })

  const words = text.split(/\s+/).filter(Boolean)
  const accentSet = new Set(accentWords.map((w) => w.toLowerCase()))

  if (shouldReduceMotion) {
    return (
      <p className="ns-reveal-statement" ref={containerRef}>
        {words.map((word, idx) => {
          const clean = word.replace(/[.,;!?—]/g, "").toLowerCase()
          return (
            <span
              className={
                accentSet.has(clean)
                  ? "ns-reveal-word is-accent"
                  : "ns-reveal-word"
              }
              key={`${word}-${idx}`}
            >
              {word}{" "}
            </span>
          )
        })}
      </p>
    )
  }

  return (
    <p className="ns-reveal-statement" ref={containerRef}>
      {words.map((word, idx) => {
        const start = idx / words.length
        const end = Math.min(1, start + 1 / words.length + 0.04)
        const clean = word.replace(/[.,;!?—]/g, "").toLowerCase()
        return (
          <RevealWord
            accent={accentSet.has(clean)}
            key={`${word}-${idx}`}
            progress={scrollYProgress}
            range={[start, end]}
            word={word}
          />
        )
      })}
    </p>
  )
}
