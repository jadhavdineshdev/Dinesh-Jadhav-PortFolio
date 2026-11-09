"use client"

import { useEffect, useState } from "react"
import { createUISFX } from "uisfx"
import {
  Briefcase,
  Code2,
  Home,
  Layers,
  Mail,
  UserRound,
} from "lucide-react"
import { useReducedMotion, motion } from "motion/react"

import { Dock, DockIcon } from "@/components/ui/dock"

function SocialIcon({ network }: { network: "github" | "linkedin" }) {
  if (network === "github") {
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.3 9.41 7.87 10.94.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.28 5.69.42.36.77 1.06.77 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  )
}

const destinations: {
  id: string
  label: string
  href: string
  Icon?: typeof Home
  network?: "github" | "linkedin"
  external?: boolean
}[] = [
  { id: "home", label: "Home", Icon: Home, href: "#home" },
  { id: "work", label: "Work", Icon: Layers, href: "#work" },
  { id: "about", label: "About", Icon: UserRound, href: "#about" },
  { id: "experience", label: "Journey", Icon: Briefcase, href: "#experience" },
  { id: "stack", label: "Stack", Icon: Code2, href: "#stack" },
  { id: "contact", label: "Contact", Icon: Mail, href: "#contact" },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/jadhavdineshdev",
    network: "github",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dinesh-jadhav-8a4273309/",
    network: "linkedin",
    external: true,
  },
]

export function PortfolioDock() {
  const [activeSection, setActiveSection] = useState("home")
  const [isMobile, setIsMobile] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)")
    const updateMobile = () => setIsMobile(mobileQuery.matches)
    updateMobile()
    mobileQuery.addEventListener("change", updateMobile)

    const sections = destinations
      .filter(({ external }) => !external)
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id)
        }
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => {
      mobileQuery.removeEventListener("change", updateMobile)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const sounds = createUISFX({
      enabled: true,
      pack: "studio",
      volume: 0.85,
      cooldownMs: 180,
    })
    let lastCueScrollY = window.scrollY
    let lastScrollCue = 0

    const playControlCue = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return
      const control = target.closest("a, button, [role='button'], summary")
      if (!control) return
      const cue = control.matches("a") ? "select" : "press"

      void sounds.unlock().then(() => {
        sounds.play(cue, { cooldownMs: 180 })
      }).catch((error: unknown) => {
        console.error("Could not play the UISFX interaction sound.", error)
      })
    }

    const playPointerCue = (event: PointerEvent) => {
      if (event.button !== 0) return
      playControlCue(event.target)
    }

    const playKeyboardCue = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return
      if (event.key === " " && event.target instanceof Element) {
        const control = event.target.closest("a, button, [role='button'], summary")
        if (control?.matches("a")) return
      }
      playControlCue(event.target)
    }

    const playScrollCue = () => {
      const nextScrollY = window.scrollY
      const distance = nextScrollY - lastCueScrollY
      if (Math.abs(distance) < 100 || Date.now() - lastScrollCue < 360) return

      lastCueScrollY = nextScrollY
      lastScrollCue = Date.now()
      void sounds.unlock().then(() => {
        sounds.play(distance > 0 ? "forward" : "back", { cooldownMs: 360 })
      }).catch((error: unknown) => {
        console.error("Could not play the UISFX scroll sound.", error)
      })
    }

    document.addEventListener("pointerdown", playPointerCue, true)
    document.addEventListener("keydown", playKeyboardCue, true)
    window.addEventListener("scroll", playScrollCue, { passive: true })
    return () => {
      document.removeEventListener("pointerdown", playPointerCue, true)
      document.removeEventListener("keydown", playKeyboardCue, true)
      window.removeEventListener("scroll", playScrollCue)
      void sounds.destroy().catch((error: unknown) => {
        console.error("Could not close the UISFX player.", error)
      })
    }
  }, [])

  return (
      <Dock
        aria-label="Portfolio navigation and social links"
        className="portfolio-dock"
        disableMagnification={Boolean(reduceMotion) || isMobile}
        iconDistance={90}
        iconMagnification={isMobile ? 32 : 38}
        iconSize={isMobile ? 32 : 28}
      >
        {destinations.map(({ id, label, Icon, href, external, network }) => (
          <DockIcon className="portfolio-dock-icon" key={id}>
            <a
              aria-current={!external && activeSection === id ? "location" : undefined}
              aria-label={label}
              className="portfolio-dock-link"
              data-active={!external && activeSection === id}
              data-label={label}
              href={href}
              onClick={external ? undefined : () => setActiveSection(id)}
              rel={external ? "noopener noreferrer" : undefined}
              target={external ? "_blank" : undefined}
            >
              {network ? (
                <span className="portfolio-dock-brand-icon">
                  <SocialIcon network={network} />
                </span>
              ) : Icon ? (
                <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
              ) : null}
              {!external && activeSection === id && (
                <motion.span
                  className="portfolio-dock-indicator"
                  layoutId="portfolio-dock-indicator"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 440, damping: 32 }
                  }
                />
              )}
              <span aria-hidden="true" className="portfolio-dock-tooltip">
                {label}
              </span>
            </a>
          </DockIcon>
        ))}
      </Dock>
  )
}
