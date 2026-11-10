// High-Fidelity Continuous Scrolling Sound Engine
// Uses the user's custom scroll audio asset (/sounds/scroll.mp3) with seamless Web Audio API looping
// Modulates gain and playback rate based on scroll velocity across desktop and mobile.

export interface ScrollSoundEngineOptions {
  enabled?: boolean
  volume?: number
}

export interface ScrollSoundEngine {
  handleScroll: (speedHint?: number) => void
  unlock: () => Promise<void>
  destroy: () => void
}

let cachedBufferPromise: Promise<ArrayBuffer> | null = null

function fetchScrollAudio(): Promise<ArrayBuffer> {
  if (!cachedBufferPromise) {
    cachedBufferPromise = fetch("/sounds/scroll.mp3")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.arrayBuffer()
      })
      .catch((err) => {
        console.warn("Could not load /sounds/scroll.mp3:", err)
        cachedBufferPromise = null
        throw err
      })
  }
  return cachedBufferPromise
}

export function createScrollSoundEngine(
  options: ScrollSoundEngineOptions = {}
): ScrollSoundEngine {
  if (typeof window === "undefined") {
    return {
      handleScroll: () => {},
      unlock: async () => {},
      destroy: () => {},
    }
  }

  const masterVolume = options.volume ?? 0.85
  const isEnabled = options.enabled ?? true
  let ctx: AudioContext | null = null
  let sourceNode: AudioBufferSourceNode | null = null
  let gainNode: GainNode | null = null
  let currentBuffer: AudioBuffer | null = null

  let stopTimeout: ReturnType<typeof setTimeout> | null = null
  let suspendTimeout: ReturnType<typeof setTimeout> | null = null
  let isPlaying = false
  let lastScrollY = window.scrollY
  let lastScrollTime = performance.now()
  let isDecoding = false

  // Pre-fetch the audio asset immediately in the background
  void fetchScrollAudio().catch(() => {})

  const initAudio = (): AudioContext | null => {
    if (ctx) return ctx
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return null

    try {
      ctx = new AudioCtx()
      gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime)
      gainNode.connect(ctx.destination)

      // Decode the custom MP3 loop
      loadBufferAndStart(ctx)

      return ctx
    } catch (err) {
      console.warn("Could not initialize scroll sound AudioContext:", err)
      return null
    }
  }

  const loadBufferAndStart = (audioContext: AudioContext) => {
    if (currentBuffer || isDecoding) return
    isDecoding = true

    fetchScrollAudio()
      .then((arrBuf) => audioContext.decodeAudioData(arrBuf.slice(0)))
      .then((decoded) => {
        isDecoding = false
        if (!decoded || !ctx) return
        currentBuffer = decoded
        startLoopNode()
      })
      .catch(() => {
        isDecoding = false
      })
  }

  const startLoopNode = () => {
    if (!ctx || !currentBuffer || !gainNode) return
    try {
      if (sourceNode) {
        try {
          sourceNode.stop()
          sourceNode.disconnect()
        } catch {}
      }

      sourceNode = ctx.createBufferSource()
      sourceNode.buffer = currentBuffer
      sourceNode.loop = true
      sourceNode.loopStart = 0
      sourceNode.loopEnd = currentBuffer.duration
      sourceNode.playbackRate.setValueAtTime(1.0, ctx.currentTime)

      sourceNode.connect(gainNode)
      sourceNode.start(0)
    } catch (err) {
      console.warn("Could not start scroll loop source node:", err)
    }
  }

  const unlock = async () => {
    const audioContext = initAudio()
    if (audioContext && audioContext.state === "suspended") {
      try {
        await audioContext.resume()
      } catch {}
    }
  }

  const stopScrolling = () => {
    isPlaying = false
    if (!ctx || !gainNode) return
    const now = ctx.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setTargetAtTime(0.0001, now, 0.08) // Smooth fade out in ~80ms

    // Suspend after 5 seconds of inactivity to save device battery
    if (suspendTimeout) clearTimeout(suspendTimeout)
    suspendTimeout = setTimeout(() => {
      if (!isPlaying && ctx && ctx.state === "running") {
        void ctx.suspend().catch(() => {})
      }
    }, 5000)
  }

  const handleScroll = (speedHint?: number) => {
    if (!isEnabled) return

    const now = performance.now()
    const currentY = window.scrollY
    const timeDelta = Math.max(now - lastScrollTime, 8)
    const distance = Math.abs(currentY - lastScrollY)
    lastScrollY = currentY
    lastScrollTime = now

    // Speed calculation
    const calculatedSpeed = (distance / timeDelta) * 32
    const speed = Math.min(Math.max(speedHint ?? calculatedSpeed, 2), 65)

    const audioContext = initAudio()
    if (!audioContext || !gainNode) return

    if (audioContext.state === "suspended") {
      void audioContext.resume().catch(() => {})
    }

    if (suspendTimeout) {
      clearTimeout(suspendTimeout)
      suspendTimeout = null
    }

    // If buffer is ready but sourceNode hasn't started yet, start it now
    if (!sourceNode && currentBuffer) {
      startLoopNode()
    }

    const ctxNow = audioContext.currentTime
    isPlaying = true

    // Normalize speed factor (0.2 to 1.5)
    const factor = Math.min(Math.max(speed / 28, 0.25), 1.4)

    // Comfortable target volume for the custom audio asset
    const targetGain = Math.min(0.42, (0.08 + factor * 0.24) * masterVolume)
    // Pitch modulation matching scroll speed
    const targetRate = Math.min(1.22, 0.92 + factor * 0.18)

    gainNode.gain.cancelScheduledValues(ctxNow)
    gainNode.gain.setTargetAtTime(targetGain, ctxNow, 0.03)

    if (sourceNode) {
      sourceNode.playbackRate.cancelScheduledValues(ctxNow)
      sourceNode.playbackRate.setTargetAtTime(targetRate, ctxNow, 0.035)
    }

    // Reset debounce timeout
    if (stopTimeout) clearTimeout(stopTimeout)
    stopTimeout = setTimeout(stopScrolling, 110)
  }

  // Wheel listener for desktop mouse/trackpad
  const handleWheel = (e: WheelEvent) => {
    const wheelSpeed = Math.min(Math.abs(e.deltaY) * 0.45, 60)
    handleScroll(wheelSpeed)
  }

  // Native scroll listener
  const handleNativeScroll = () => {
    handleScroll()
  }

  // Mobile Touch Drag listener for instant audio on mobile swipe
  let lastTouchY = 0
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      lastTouchY = e.touches[0].clientY
    }
    void unlock()
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const currentTouchY = e.touches[0].clientY
      const deltaY = Math.abs(currentTouchY - lastTouchY)
      lastTouchY = currentTouchY
      const touchSpeed = Math.min(deltaY * 1.6, 60)
      handleScroll(touchSpeed)
    }
  }

  // Event Listeners
  window.addEventListener("wheel", handleWheel, { passive: true })
  window.addEventListener("scroll", handleNativeScroll, { passive: true })
  window.addEventListener("touchstart", handleTouchStart, { passive: true })
  window.addEventListener("touchmove", handleTouchMove, { passive: true })

  // Unlock on first user interaction
  const removeUnlockListeners = () => {
    window.removeEventListener("pointerdown", handleFirstInteraction, true)
    window.removeEventListener("keydown", handleFirstInteraction, true)
    window.removeEventListener("touchstart", handleFirstInteraction, true)
  }

  const handleFirstInteraction = () => {
    void unlock()
    removeUnlockListeners()
  }

  window.addEventListener("pointerdown", handleFirstInteraction, {
    passive: true,
    capture: true,
  })
  window.addEventListener("keydown", handleFirstInteraction, {
    passive: true,
    capture: true,
  })
  window.addEventListener("touchstart", handleFirstInteraction, {
    passive: true,
    capture: true,
  })

  return {
    handleScroll,
    unlock,
    destroy: () => {
      removeUnlockListeners()
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleNativeScroll)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      if (stopTimeout) clearTimeout(stopTimeout)
      if (suspendTimeout) clearTimeout(suspendTimeout)
      if (sourceNode) {
        try {
          sourceNode.stop()
          sourceNode.disconnect()
        } catch {}
      }
      if (gainNode) {
        try {
          gainNode.disconnect()
        } catch {}
      }
      if (ctx && ctx.state !== "closed") {
        void ctx.close().catch(() => {})
      }
      ctx = null
      sourceNode = null
      gainNode = null
    },
  }
}
