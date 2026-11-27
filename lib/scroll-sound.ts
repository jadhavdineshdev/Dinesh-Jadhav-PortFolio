// Pace-Synced Mechanical Scroll Sound Engine
// Uses the user's uploaded scroll audio (/sounds/scroll-tick.wav) sliced into clean
// individual tick grains so playback cadence naturally matches the user's exact scroll pace.

export interface ScrollSoundEngineOptions {
  enabled?: boolean
  volume?: number
  stepPx?: number
}

export interface ScrollSoundEngine {
  notifyScroll: (scrollY: number, velocityHint?: number) => void
  unlock: () => Promise<void>
  destroy: () => void
}

// Exact transient windows (in seconds) of the 9 crisp ticks in /sounds/scroll-tick.wav
const TICK_WINDOWS: ReadonlyArray< readonly [number, number] > = [
  [0.0, 0.028],
  [0.029, 0.064],
  [0.068, 0.097],
  [0.099, 0.127],
  [0.129, 0.157],
  [0.159, 0.187],
  [0.189, 0.217],
  [0.219, 0.247],
  [0.249, 0.283],
]

let cachedWavPromise: Promise<ArrayBuffer> | null = null

function fetchScrollTickWav(): Promise<ArrayBuffer> {
  if (!cachedWavPromise) {
    cachedWavPromise = fetch("/sounds/scroll-tick.wav")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.arrayBuffer()
      })
      .catch((err) => {
        console.warn("Could not load /sounds/scroll-tick.wav:", err)
        cachedWavPromise = null
        throw err
      })
  }
  return cachedWavPromise
}

function sliceTickBuffers(
  audioContext: AudioContext,
  fullBuffer: AudioBuffer
): AudioBuffer[] {
  const sampleRate = fullBuffer.sampleRate
  const channels = fullBuffer.numberOfChannels
  const fadeInSamples = Math.max(8, Math.floor(sampleRate * 0.0006))
  const fadeOutSamples = Math.max(24, Math.floor(sampleRate * 0.0035))
  const slices: AudioBuffer[] = []

  for (const [startSec, endSec] of TICK_WINDOWS) {
    const startFrame = Math.max(0, Math.floor(startSec * sampleRate))
    const endFrame = Math.min(fullBuffer.length, Math.floor(endSec * sampleRate))
    const length = endFrame - startFrame
    if (length <= fadeOutSamples) continue

    const sub = audioContext.createBuffer(channels, length, sampleRate)
    for (let ch = 0; ch < channels; ch++) {
      const srcData = fullBuffer.getChannelData(ch)
      const dstData = sub.getChannelData(ch)
      for (let i = 0; i < length; i++) {
        let env = 1
        if (i < fadeInSamples) {
          env = i / fadeInSamples
        } else if (i > length - fadeOutSamples) {
          const rem = length - i
          env = 0.5 * (1 - Math.cos((Math.PI * rem) / fadeOutSamples))
        }
        dstData[i] = srcData[startFrame + i] * env
      }
    }
    slices.push(sub)
  }

  return slices.length > 0 ? slices : [fullBuffer]
}

export function createScrollSoundEngine(
  options: ScrollSoundEngineOptions = {}
): ScrollSoundEngine {
  if (typeof window === "undefined") {
    return {
      notifyScroll: () => {},
      unlock: async () => {},
      destroy: () => {},
    }
  }

  const isEnabled = options.enabled ?? true
  const masterVolume = options.volume ?? 0.9
  const stepPx = options.stepPx ?? 36
  const minTickIntervalMs = 24

  let ctx: AudioContext | null = null
  let masterGain: GainNode | null = null
  let tickSlices: AudioBuffer[] = []
  let isDecoding = false
  let tickCursor = 0

  let lastScrollY = window.scrollY
  let lastMoveTime = performance.now()
  let lastTickTime = 0
  let accumulatedPx = 0
  let suspendTimer: ReturnType<typeof setTimeout> | null = null

  // Pre-fetch immediately so the WAV is already in browser memory on first scroll
  void fetchScrollTickWav().catch(() => {})

  const ensureContext = (): AudioContext | null => {
    if (ctx) return ctx
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return null

    try {
      ctx = new AudioCtx()
      masterGain = ctx.createGain()
      masterGain.gain.value = masterVolume
      masterGain.connect(ctx.destination)
      decodeTicks(ctx)
      return ctx
    } catch {
      return null
    }
  }

  const decodeTicks = (audioContext: AudioContext) => {
    if (tickSlices.length > 0 || isDecoding) return
    isDecoding = true

    fetchScrollTickWav()
      .then((buf) => audioContext.decodeAudioData(buf.slice(0)))
      .then((decoded) => {
        isDecoding = false
        if (!ctx) return
        tickSlices = sliceTickBuffers(audioContext, decoded)
      })
      .catch(() => {
        isDecoding = false
      })
  }

  const scheduleIdleSuspend = () => {
    if (suspendTimer) clearTimeout(suspendTimer)
    suspendTimer = setTimeout(() => {
      if (ctx && ctx.state === "running") {
        void ctx.suspend().catch(() => {})
      }
    }, 6000)
  }

  const fireTick = (speedPxPerMs: number) => {
    const audioContext = ensureContext()
    if (!audioContext || !masterGain) return

    if (audioContext.state !== "running") {
      void audioContext.resume().catch(() => {})
      return
    }

    if (tickSlices.length === 0) {
      decodeTicks(audioContext)
      return
    }

    const nowMs = performance.now()
    if (nowMs - lastTickTime < minTickIntervalMs) return
    lastTickTime = nowMs

    const buffer = tickSlices[tickCursor % tickSlices.length]
    tickCursor += 1

    // Normalize velocity (0 = slow creep, 1 = brisk scroll)
    const normSpeed = Math.min(Math.max((speedPxPerMs - 0.15) / 2.6, 0), 1)

    // Soften slightly if voice note is actively speaking so both coexist cleanly
    const voiceEl = document.querySelector<HTMLAudioElement>("audio.portrait-audio")
    const voiceDuck = voiceEl && !voiceEl.paused ? 0.45 : 1

    const gainValue = (0.34 + normSpeed * 0.38) * voiceDuck
    const playbackRate = 0.96 + normSpeed * 0.1

    try {
      const source = audioContext.createBufferSource()
      const tickGain = audioContext.createGain()
      source.buffer = buffer
      source.playbackRate.value = playbackRate
      tickGain.gain.value = gainValue

      source.connect(tickGain)
      tickGain.connect(masterGain)
      source.start(0)
      scheduleIdleSuspend()
    } catch {
      // Ignore transient Web Audio errors
    }
  }

  const notifyScroll = (scrollY: number, velocityHint?: number) => {
    if (!isEnabled) return

    const now = performance.now()
    const dt = Math.max(now - lastMoveTime, 6)
    const deltaPx = Math.abs(scrollY - lastScrollY)
    lastScrollY = scrollY
    lastMoveTime = now

    if (deltaPx <= 0.2 || deltaPx > 2400) {
      // Ignore layout jumps / instant anchor teleports
      return
    }

    accumulatedPx += deltaPx
    const speedPxPerMs =
      velocityHint !== undefined
        ? Math.abs(velocityHint) / 1000
        : deltaPx / dt

    if (accumulatedPx >= stepPx) {
      // Carry remainder modulo stepPx so fast flicks don't build up a backlog
      accumulatedPx = accumulatedPx % stepPx
      fireTick(speedPxPerMs)
    }
  }

  const handleNativeScroll = () => {
    notifyScroll(window.scrollY)
  }

  const unlock = async () => {
    const audioContext = ensureContext()
    if (audioContext && audioContext.state === "suspended") {
      try {
        await audioContext.resume()
      } catch {}
    }
  }

  const handleGestureUnlock = () => {
    void unlock()
  }

  window.addEventListener("scroll", handleNativeScroll, { passive: true })
  window.addEventListener("pointerdown", handleGestureUnlock, {
    passive: true,
    capture: true,
  })
  window.addEventListener("touchstart", handleGestureUnlock, {
    passive: true,
    capture: true,
  })
  window.addEventListener("keydown", handleGestureUnlock, {
    passive: true,
    capture: true,
  })
  window.addEventListener("wheel", handleGestureUnlock, {
    passive: true,
    capture: true,
  })

  return {
    notifyScroll,
    unlock,
    destroy: () => {
      window.removeEventListener("scroll", handleNativeScroll)
      window.removeEventListener("pointerdown", handleGestureUnlock, true)
      window.removeEventListener("touchstart", handleGestureUnlock, true)
      window.removeEventListener("keydown", handleGestureUnlock, true)
      window.removeEventListener("wheel", handleGestureUnlock, true)
      if (suspendTimer) clearTimeout(suspendTimer)
      if (masterGain) {
        try {
          masterGain.disconnect()
        } catch {}
      }
      if (ctx && ctx.state !== "closed") {
        void ctx.close().catch(() => {})
      }
      ctx = null
      masterGain = null
      tickSlices = []
    },
  }
}
