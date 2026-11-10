// Tactile Continuous Scrolling Sound Engine
// Replaces discrete arcade/game blips with a realistic, smooth tactile mechanical scroll wheel loop.

export interface ScrollSoundEngineOptions {
  enabled?: boolean
  volume?: number
}

export interface ScrollSoundEngine {
  handleScroll: (speedHint?: number) => void
  unlock: () => Promise<void>
  destroy: () => void
}

function synthesizeScrollLoop(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const baseDuration = 1.8 // 1.8 second loop
  const fadeDuration = 0.22 // 220ms equal-power crossfade
  const baseSamples = Math.floor(baseDuration * sampleRate)
  const fadeSamples = Math.floor(fadeDuration * sampleRate)
  const totalSamples = baseSamples + fadeSamples

  const buffer = ctx.createBuffer(1, baseSamples, sampleRate)
  const channelData = buffer.getChannelData(0)
  const raw = new Float32Array(totalSamples)

  let b0 = 0
  let b1 = 0
  let b2 = 0
  let b3 = 0
  const tickPeriod = Math.floor(sampleRate / 38) // ~38 micro-detents per sec

  // Deterministic PRNG for reliable, consistent warmth
  let seed = 424242
  function random() {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return (seed / 4294967296) * 2 - 1
  }

  for (let i = 0; i < totalSamples; i++) {
    const white = random()
    b0 = 0.994 * b0 + white * 0.035
    b1 = 0.97 * b1 + white * 0.035
    b2 = 0.89 * b2 + white * 0.035
    b3 = 0.72 * b3 + white * 0.035
    const friction = (b0 + b1 + b2 + b3) * 0.14

    const bearing = Math.sin((2 * Math.PI * 72 * i) / sampleRate) * 0.02
    const phase = (i % tickPeriod) / sampleRate
    const click = Math.sin(2 * Math.PI * 1150 * phase) * Math.exp(-phase * 1400) * 0.16
    const clickSub = Math.sin(2 * Math.PI * 580 * phase) * Math.exp(-phase * 950) * 0.08

    raw[i] = friction + bearing + click + clickSub
  }

  // Equal-power crossfade for seamless, zero-boundary click looping
  let peak = 0.0001
  for (let i = 0; i < baseSamples; i++) {
    let val: number
    if (i < fadeSamples) {
      const t = i / fadeSamples
      const wIn = Math.sin(t * Math.PI * 0.5)
      const wOut = Math.cos(t * Math.PI * 0.5)
      val = raw[i] * wIn + raw[baseSamples + i] * wOut
    } else {
      val = raw[i]
    }
    channelData[i] = val
    const abs = Math.abs(val)
    if (abs > peak) peak = abs
  }

  const scale = 0.35 / peak
  for (let i = 0; i < baseSamples; i++) {
    channelData[i] *= scale
  }

  return buffer
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
  let isEnabled = options.enabled ?? true
  let ctx: AudioContext | null = null
  let sourceNode: AudioBufferSourceNode | null = null
  let gainNode: GainNode | null = null
  let filterNode: BiquadFilterNode | null = null
  let currentBuffer: AudioBuffer | null = null

  let stopTimeout: ReturnType<typeof setTimeout> | null = null
  let suspendTimeout: ReturnType<typeof setTimeout> | null = null
  let isPlaying = false
  let lastScrollY = window.scrollY
  let lastScrollTime = performance.now()

  const initAudio = () => {
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

      filterNode = ctx.createBiquadFilter()
      filterNode.type = "lowpass"
      filterNode.frequency.setValueAtTime(1800, ctx.currentTime)
      filterNode.Q.setValueAtTime(0.7, ctx.currentTime)

      filterNode.connect(gainNode)
      gainNode.connect(ctx.destination)

      // 1. Synthesize procedural fallback immediately (zero wait)
      currentBuffer = synthesizeScrollLoop(ctx)
      startLoopNode()

      // 2. Fetch high-definition studio loop in background
      fetch("/sounds/scroll-loop.wav")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load wav")
          return res.arrayBuffer()
        })
        .then((buf) => ctx?.decodeAudioData(buf))
        .then((decoded) => {
          if (decoded && ctx) {
            currentBuffer = decoded
            // Swap to HD buffer seamlessly on next loop or update
            if (sourceNode) {
              try {
                sourceNode.buffer = decoded
              } catch {
                // If browser doesn't allow in-place buffer swap, restart loop node
                restartLoopNode()
              }
            }
          }
        })
        .catch(() => {
          // Keep procedural buffer
        })

      return ctx
    } catch (err) {
      console.warn("Could not initialize scroll sound AudioContext:", err)
      return null
    }
  }

  const startLoopNode = () => {
    if (!ctx || !currentBuffer || !filterNode) return
    try {
      sourceNode = ctx.createBufferSource()
      sourceNode.buffer = currentBuffer
      sourceNode.loop = true
      sourceNode.loopStart = 0
      sourceNode.loopEnd = currentBuffer.duration
      sourceNode.playbackRate.setValueAtTime(1.0, ctx.currentTime)

      sourceNode.connect(filterNode)
      sourceNode.start(0)
    } catch (err) {
      console.warn("Could not start scroll loop source node:", err)
    }
  }

  const restartLoopNode = () => {
    if (!ctx) return
    try {
      if (sourceNode) {
        sourceNode.stop()
        sourceNode.disconnect()
      }
    } catch {}
    startLoopNode()
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
    gainNode.gain.setTargetAtTime(0.0001, now, 0.07) // Smooth fade out in ~70ms

    // Suspend after 4 seconds of inactivity to save power
    if (suspendTimeout) clearTimeout(suspendTimeout)
    suspendTimeout = setTimeout(() => {
      if (!isPlaying && ctx && ctx.state === "running") {
        void ctx.suspend().catch(() => {})
      }
    }, 4000)
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
    const calculatedSpeed = (distance / timeDelta) * 30
    const speed = Math.min(Math.max(speedHint ?? calculatedSpeed, 2), 65)

    const audioContext = initAudio()
    if (!audioContext || !gainNode || !filterNode || !sourceNode) return

    if (audioContext.state === "suspended") {
      void audioContext.resume().catch(() => {})
    }

    if (suspendTimeout) {
      clearTimeout(suspendTimeout)
      suspendTimeout = null
    }

    const ctxNow = audioContext.currentTime
    isPlaying = true

    // Normalize speed factor (0.2 to 1.5)
    const factor = Math.min(Math.max(speed / 28, 0.25), 1.4)

    // Comfortable target volume
    const targetGain = Math.min(0.24, (0.05 + factor * 0.12) * masterVolume)
    // Dynamic pitch/playbackRate reflecting reel speed
    const targetRate = Math.min(1.3, 0.88 + factor * 0.25)
    // Lowpass filter frequency opens up slightly with speed
    const targetCutoff = Math.min(3200, 1500 + factor * 1100)

    gainNode.gain.cancelScheduledValues(ctxNow)
    gainNode.gain.setTargetAtTime(targetGain, ctxNow, 0.035)

    sourceNode.playbackRate.cancelScheduledValues(ctxNow)
    sourceNode.playbackRate.setTargetAtTime(targetRate, ctxNow, 0.04)

    filterNode.frequency.cancelScheduledValues(ctxNow)
    filterNode.frequency.setTargetAtTime(targetCutoff, ctxNow, 0.04)

    // Reset debounce timeout
    if (stopTimeout) clearTimeout(stopTimeout)
    stopTimeout = setTimeout(stopScrolling, 95)
  }

  // Wheel listener for instant sound start as soon as finger touches wheel
  const handleWheel = (e: WheelEvent) => {
    const wheelSpeed = Math.min(Math.abs(e.deltaY) * 0.4, 60)
    handleScroll(wheelSpeed)
  }

  const handleNativeScroll = () => {
    handleScroll()
  }

  // Passive window listeners
  window.addEventListener("wheel", handleWheel, { passive: true })
  window.addEventListener("scroll", handleNativeScroll, { passive: true })

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
      if (filterNode) {
        try {
          filterNode.disconnect()
        } catch {}
      }
      if (ctx && ctx.state !== "closed") {
        void ctx.close().catch(() => {})
      }
      ctx = null
      sourceNode = null
      gainNode = null
      filterNode = null
    },
  }
}

