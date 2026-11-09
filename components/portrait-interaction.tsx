"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { gsap } from "gsap"
import { createPortal } from "react-dom"

const subscribeToPortal = () => () => {}
const getPortalRootSnapshot = () => document.body
const getServerPortalRootSnapshot = (): HTMLElement | null => null
const voiceTranscript = [
  "Welcome to my digital workspace.",
  "I am Dinesh. I break things down.",
  "See how they are and build them back better.",
  "Feel free to explore. Open the directory folders to inspect my projects and experiences.",
  "Or use the bottom dock to jump straight to my GitHub and my projects and experiences.",
  "Use the bottom dock to jump straight to my GitHub and listen.",
  "So for now, have fun looking around.",
  "Have a good day.",
]
const transcriptWeights = voiceTranscript.map(
  (line) => line.trim().split(/\s+/).length
)
const transcriptWeightTotal = transcriptWeights.reduce(
  (sum, weight) => sum + weight,
  0
)

export function PortraitInteraction({
  voiceSrc = "/dinesh-voice.mp3",
}: {
  voiceSrc?: string
}) {
  const reduceMotion = useReducedMotion()
  const portalRoot = useSyncExternalStore(
    subscribeToPortal,
    getPortalRootSnapshot,
    getServerPortalRootSnapshot
  )
  const xValue = useMotionValue(0)
  const yValue = useMotionValue(0)
  const x = useSpring(xValue, { stiffness: 280, damping: 22 })
  const y = useSpring(yValue, { stiffness: 280, damping: 22 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const stickyNoteRef = useRef<HTMLDivElement>(null)
  const voicePlaybackArmed = useRef(false)
  const [voicePlaying, setVoicePlaying] = useState(false)
  const [currentTranscriptLine, setCurrentTranscriptLine] = useState(0)

  function updateTranscriptProgress(audio: HTMLAudioElement) {
    if (audio.paused || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      return
    }

    const elapsed =
      (audio.currentTime / audio.duration) * transcriptWeightTotal
    let boundary = 0
    const lineIndex = transcriptWeights.findIndex((weight) => {
      boundary += weight
      return elapsed < boundary
    })

    setCurrentTranscriptLine(
      lineIndex === -1 ? voiceTranscript.length - 1 : lineIndex
    )
  }

  useEffect(() => {
    const note = stickyNoteRef.current
    if (!note) return

    if (!voicePlaying) {
      gsap.to(note, {
        autoAlpha: 0,
        x: 70,
        y: 28,
        rotation: 6,
        scale: 0.94,
        duration: reduceMotion ? 0 : 0.38,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          if (note.matches(":popover-open")) note.hidePopover()
        },
      })
      return
    }

    if (!note.matches(":popover-open")) note.showPopover()

    const entrance = gsap.fromTo(
      note,
      { autoAlpha: 0, x: 70, y: 28, rotation: 6, scale: 0.94 },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotation: -2,
        scale: 1,
        duration: reduceMotion ? 0 : 0.72,
        ease: "back.out(1.45)",
        overwrite: true,
      }
    )
    const float = reduceMotion
      ? undefined
      : gsap.to(note, {
          y: "+=5",
          rotation: -0.5,
          duration: 2.4,
          delay: 0.72,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })

    return () => {
      entrance.kill()
      float?.kill()
    }
  }, [portalRoot, reduceMotion, voicePlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !voiceSrc) return

    const handlePreloaderComplete = () => {
      voicePlaybackArmed.current = true
      resumeVoice()
    }

    const removeUnlockListeners = () => {
      window.removeEventListener("pointerdown", resumeVoice)
      window.removeEventListener("keydown", resumeVoice)
    }

    const resumeVoice = () => {
      if (!voicePlaybackArmed.current) return
      if (!audio.paused) {
        removeUnlockListeners()
        return
      }

      void audio.play().catch((error: unknown) => {
        console.info("Voice autoplay is waiting for browser permission.", error)
      })
    }

    audio.addEventListener("playing", removeUnlockListeners)
    window.addEventListener("portfolio:preloader-complete", handlePreloaderComplete)
    window.addEventListener("pointerdown", resumeVoice, { passive: true })
    window.addEventListener("keydown", resumeVoice)
    if (document.documentElement.dataset.preloaderComplete === "true") {
      handlePreloaderComplete()
    }

    return () => {
      audio.removeEventListener("playing", removeUnlockListeners)
      window.removeEventListener(
        "portfolio:preloader-complete",
        handlePreloaderComplete
      )
      removeUnlockListeners()
    }
  }, [portalRoot, voiceSrc])

  useEffect(() => {
    if (reduceMotion) return

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const resetMagnet = () => {
      x.set(0)
      y.set(0)
    }
    const followPointer = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") {
        resetMagnet()
        return
      }

      const bounds = triggerRef.current?.getBoundingClientRect()
      if (!bounds) return

      const offsetX = event.clientX - (bounds.left + bounds.width / 2)
      const offsetY = event.clientY - (bounds.top + bounds.height / 2)
      const distance = Math.hypot(offsetX, offsetY)
      const radius = 150

      if (distance < radius) {
        const strength = 1 - distance / radius
        x.set(offsetX * 0.12 * strength)
        y.set(offsetY * 0.12 * strength)
      } else {
        resetMagnet()
      }
    }
    const updatePointerListener = () => {
      if (pointerQuery.matches) {
        window.addEventListener("pointermove", followPointer)
      } else {
        window.removeEventListener("pointermove", followPointer)
        resetMagnet()
      }
    }

    updatePointerListener()
    pointerQuery.addEventListener("change", updatePointerListener)
    window.addEventListener("blur", resetMagnet)
    return () => {
      pointerQuery.removeEventListener("change", updatePointerListener)
      window.removeEventListener("pointermove", followPointer)
      window.removeEventListener("blur", resetMagnet)
    }
  }, [reduceMotion, x, y])

  function openPortrait() {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
      closeRef.current?.focus()
    }

    if (voicePlaybackArmed.current && voiceSrc && audioRef.current) {
      if (!audioRef.current.paused) return
      void audioRef.current.play().catch((error: unknown) => {
        console.error("Could not play the supplied voice recording.", error)
      })
    }
  }

  function closePortrait() {
    audioRef.current?.pause()
    if (dialogRef.current?.open) dialogRef.current.close()
    triggerRef.current?.focus()
  }

  return (
    <>
      <span className="portrait-magnetic-area">
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 1.5, 0] }}
          className="portrait-float"
          transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
        >
          <motion.button
            ref={triggerRef}
            aria-haspopup="dialog"
            aria-label="View Dinesh's portrait"
            className="portrait-button"
            onClick={openPortrait}
            style={{ x, y }}
            type="button"
          >
            <span className="portrait-image">
              <Image
                alt="Dinesh Jadhav"
                fill
                priority
                sizes="(max-width: 640px) 48px, 68px"
                src="/dinesh-portrait.jpeg"
              />
            </span>
          </motion.button>
        </motion.span>
        <span aria-hidden="true" className="portrait-hint">
          <span className="portrait-hint-mark">↙</span>
          <span>tap to hear<br />my voice</span>
        </span>
      </span>

      {portalRoot &&
        createPortal(
          <>
            <div
              ref={stickyNoteRef}
              aria-hidden={!voicePlaying}
              aria-label="Transcript of Dinesh's voice note"
              className="voice-sticky-note"
              popover="manual"
              role="region"
            >
              <span aria-hidden="true" className="voice-sticky-tape" />
              <header className="voice-sticky-header">
                <span>VOICE NOTE / 01</span>
                <span aria-hidden="true" className="voice-sticky-wave">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </header>
              <h2>A little hello</h2>
              <div className="voice-transcript">
                {voiceTranscript.map((line, index) => (
                  <p
                    aria-current={
                      voicePlaying && currentTranscriptLine === index
                        ? "true"
                        : undefined
                    }
                    className={
                      currentTranscriptLine === index
                        ? "voice-transcript-line is-current"
                        : "voice-transcript-line"
                    }
                    key={line}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <span className="voice-sticky-footer">DINESH · MUMBAI</span>
            </div>
            <dialog
              aria-label="Dinesh Jadhav's portrait"
              className="portrait-dialog"
              onCancel={(event) => {
                event.preventDefault()
                closePortrait()
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) closePortrait()
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault()
                  closePortrait()
                }
              }}
              onClose={() => {
                audioRef.current?.pause()
                triggerRef.current?.focus()
              }}
              ref={dialogRef}
            >
              <div className="portrait-dialog-content">
                <button
                  ref={closeRef}
                  aria-label="Close portrait"
                  className="portrait-dialog-close"
                  onClick={closePortrait}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
                <div className="portrait-dialog-image">
                  <Image
                    alt="Dinesh Jadhav"
                    fill
                    sizes="(max-width: 640px) 82vw, 420px"
                    src="/dinesh-portrait.jpeg"
                  />
                </div>
                <p>
                  {voiceSrc
                    ? "A little hello, in my own voice."
                    : "A voice note will live here when I record one."}
                </p>
                {voiceSrc && (
                  <audio
                    ref={audioRef}
                    aria-label="Dinesh's voice note"
                    className="portrait-audio"
                    onEnded={() => setVoicePlaying(false)}
                    onPause={() => setVoicePlaying(false)}
                    onPlaying={(event) => {
                      setVoicePlaying(true)
                      updateTranscriptProgress(event.currentTarget)
                    }}
                    onTimeUpdate={(event) =>
                      updateTranscriptProgress(event.currentTarget)
                    }
                    preload="auto"
                    src={voiceSrc}
                  >
                    Your browser does not support audio playback.
                  </audio>
                )}
              </div>
            </dialog>
          </>,
          portalRoot
        )}
    </>
  )
}
