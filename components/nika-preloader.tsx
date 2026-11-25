"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

const COLUMNS = [
  { index: "[ 01 ]", label: "Dinesh Jadhav", glyph: "2" },
  { index: "[ 02 ]", label: "Portfolio edition", glyph: "0" },
  { index: "[ 03 ]", label: "", glyph: "2" },
  { index: "[ 04 ]", label: "", glyph: "6" },
]

export function NikaPreloader({ duration = 1400 }: { duration?: number }) {
  const shouldReduceMotion = useReducedMotion()
  const [stage, setStage] = useState<"hold" | "exiting" | "done">("hold")

  useEffect(() => {
    const holdMs = shouldReduceMotion ? 0 : duration
    const exitTimer = window.setTimeout(() => {
      setStage("exiting")
    }, holdMs)
    return () => window.clearTimeout(exitTimer)
  }, [duration, shouldReduceMotion])

  useEffect(() => {
    if (stage !== "exiting") return
    const exitDurationMs = shouldReduceMotion ? 0 : 680
    const doneTimer = window.setTimeout(() => {
      setStage("done")
      document.documentElement.dataset.preloaderComplete = "true"
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("portfolio:preloader-complete"))
      })
    }, exitDurationMs)
    return () => window.clearTimeout(doneTimer)
  }, [stage, shouldReduceMotion])

  useEffect(() => {
    if (stage === "done") return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [stage])

  if (stage === "done") return null

  const isExiting = stage === "exiting"

  return (
    <div aria-live="polite" className="nk-loader" role="status">
      <span className="sr-only">Loading Dinesh Jadhav Portfolio 2026</span>
      <div className="nk-loader-cols">
        {COLUMNS.map((col, idx) => (
          <motion.div
            animate={
              isExiting
                ? shouldReduceMotion
                  ? { opacity: 0 }
                  : { y: "-102%" }
                : { y: "0%" }
            }
            className="nk-loader-col"
            initial={{ y: "0%" }}
            key={col.index}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.56,
              delay: shouldReduceMotion ? 0 : idx * 0.055,
              ease: [0.65, 0, 0.35, 1],
            }}
          >
            <div className="nk-loader-head">
              <div className="nk-loader-row">
                <span className="nk-loader-idx">{col.index}</span>
                <span className="nk-loader-mark" />
              </div>
              {col.label && (
                <span className="nk-loader-caption">{col.label}</span>
              )}
            </div>

            <div className="nk-loader-glyph-clip">
              <motion.span
                animate={
                  isExiting
                    ? { y: "-28%", opacity: 0 }
                    : { y: "0%", opacity: 1 }
                }
                className="nk-loader-glyph"
                initial={{ y: "45%", opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.46,
                  delay: shouldReduceMotion ? 0 : idx * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {col.glyph}
              </motion.span>
            </div>

            <motion.div
              animate={{ scaleX: 1 }}
              className="nk-loader-rule"
              initial={{ scaleX: 0 }}
              style={{ transformOrigin: "left" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.85,
                delay: idx * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
