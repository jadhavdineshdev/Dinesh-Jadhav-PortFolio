declare module "uisfx" {
  export type CueName = "press" | "select" | "swipe" | "forward" | "back"
  export type PackName = "soft" | "mechanical" | "studio"

  export interface PlayingUISFX {
    stop(): void
    ended: Promise<void>
  }

  export interface UISFXPlayer {
    unlock(): Promise<void>
    play(cue: CueName, options?: { cooldownMs?: number }): PlayingUISFX | undefined
    destroy(): Promise<void>
  }

  export function createUISFX(options?: {
    pack?: PackName
    volume?: number
    enabled?: boolean
    maxVoices?: number
    cooldownMs?: number
  }): UISFXPlayer
}
