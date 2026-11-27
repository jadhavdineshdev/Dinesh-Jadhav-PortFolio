"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { createScrollSoundEngine } from "@/lib/scroll-sound"

export function SmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )
    const desktopPointer = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)"
    )

    // Pace-synced scroll tick audio active on both desktop & mobile
    const soundEngine = createScrollSoundEngine({
      enabled: true,
      volume: 0.92,
      stepPx: 36,
    })

    let lenis: Lenis | undefined

    const syncScrollMode = () => {
      const shouldUseLenis = desktopPointer.matches && !motionPreference.matches

      if (shouldUseLenis && !lenis) {
        lenis = new Lenis({
          anchors: true,
          autoRaf: true,
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
        })
      } else if (!shouldUseLenis && lenis) {
        lenis.destroy()
        lenis = undefined
      }
    }

    syncScrollMode()
    motionPreference.addEventListener("change", syncScrollMode)
    desktopPointer.addEventListener("change", syncScrollMode)

    return () => {
      motionPreference.removeEventListener("change", syncScrollMode)
      desktopPointer.removeEventListener("change", syncScrollMode)
      lenis?.destroy()
      soundEngine.destroy()
    }
  }, [])

  return null
}
