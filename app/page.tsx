"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"

import { PortraitInteraction } from "@/components/portrait-interaction"
import { ZacharyWorkSection } from "@/components/zachary-work-section"
import { NikaScrollReveal } from "@/components/nika-scroll-reveal"
import { BookCallModal, type ContactTopic } from "@/components/book-call-modal"

const contactEmailUrl =
  "https://mail.google.com/mail/?view=cm&fs=1&to=dineshjadhavdev%40gmail.com"

interface DisciplineItem {
  id: string
  index: string
  count: string
  title: string
  shortTitle: string
  projectTitle: string
  projectTag: string
  summary: string
  deliverables: string[]
  tools: string[]
  ctaLabel: string
  ctaHref: string
}

const disciplines: DisciplineItem[] = [
  {
    id: "fullstack",
    index: "[ 01 ]",
    count: "02",
    title: "Full-Stack Web",
    shortTitle: "Full-Stack",
    projectTitle: "CuraChain",
    projectTag: "Production EHR",
    summary:
      "End-to-end web applications engineered from responsive React interfaces down to Python FastAPI, Node.js, and PostgreSQL data layers.",
    deliverables: ["React & Next.js Apps", "FastAPI & Node APIs", "OAuth 2.0 & JWT"],
    tools: [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
    ],
    ctaLabel: "See CuraChain",
    ctaHref: "#curachain",
  },
  {
    id: "blockchain",
    index: "[ 02 ]",
    count: "01",
    title: "Blockchain & Trust",
    shortTitle: "Blockchain",
    projectTitle: "CuraChain Ledger",
    projectTag: "Hyperledger Fabric",
    summary:
      "Dual-layer healthcare architecture anchoring SHA-256 integrity proofs and revocable patient consent grants on Hyperledger Fabric via Go smart contracts.",
    deliverables: [
      "Go Chaincode",
      "SHA-256 Tamper Detection",
      "Docker & Kubernetes",
    ],
    tools: [
      "Hyperledger Fabric",
      "Go Chaincode",
      "Docker",
      "Kubernetes",
      "SHA-256",
    ],
    ctaLabel: "Inspect Repo",
    ctaHref: "https://github.com/jadhavdineshdev/CuraChain",
  },
  {
    id: "interfaces",
    index: "[ 03 ]",
    count: "02",
    title: "Motion & Interfaces",
    shortTitle: "Interfaces",
    projectTitle: "DocsBoard",
    projectTag: "Local-First",
    summary:
      "Tactile workspaces and editorial web surfaces powered by Tailwind CSS, GSAP, Motion springs, and zero-latency client-side persistence.",
    deliverables: ["Spatial UI", "GSAP & Motion Physics", "Design Systems"],
    tools: ["Tailwind CSS", "GSAP", "Motion", "Three.js", "Vite", "Figma"],
    ctaLabel: "Launch DocsBoard",
    ctaHref: "https://docs-board.vercel.app/",
  },
  {
    id: "ai-data",
    index: "[ 04 ]",
    count: "01",
    title: "AI & Data Science",
    shortTitle: "AI & Data",
    projectTitle: "B.Tech '27",
    projectTag: "YTC · CGPA 7.25",
    summary:
      "Studying Artificial Intelligence and Data Science while applying algorithmic thinking, clean schemas, and data pipelines to real products.",
    deliverables: ["Data Modeling", "REST Integrations", "System Architecture"],
    tools: ["Python", "SQL", "MongoDB", "Git & GitHub", "Postman"],
    ctaLabel: "View GitHub",
    ctaHref: "https://github.com/jadhavdineshdev",
  },
]

const studioNotes = [
  {
    num: "01",
    category: "Blockchain EHR",
    title: "CuraChain",
    quote:
      "Storing raw clinical scans on a ledger hurts privacy and speed. Pairing FastAPI off-chain storage with on-chain Hyperledger Fabric SHA-256 hashes made patient trust part of the UI.",
    role: "Full-Stack & Chaincode Architecture",
    href: "#curachain",
  },
  {
    num: "02",
    category: "Workspace Tool",
    title: "DocsBoard",
    quote:
      "Most workspace tools bury you in logins before you write a word. DocsBoard opens instantly in the browser—drop Markdown, PDFs, or JSON and pick up right where you left off.",
    role: "Frontend & Local-First Engine",
    href: "#docsboard",
  },
  {
    num: "03",
    category: "Internship",
    title: "Prodigy InfoTech",
    quote:
      "My first experience shipping interfaces in a team—connecting live weather APIs and shaping responsive layouts that held up cleanly across desktop and mobile.",
    role: "Frontend Web Developer Intern · Aug–Sep 2024",
    href: "#journey",
  },
  {
    num: "04",
    category: "Education",
    title: "AI & Data Science",
    quote:
      "Pursuing my B.Tech at Yashoda Technical Campus (2023–2027, CGPA 7.25)—learning intelligent systems in class while building practical software outside it.",
    role: "B.Tech Undergraduate · Maharashtra",
    href: "#journey",
  },
]

const journeyRows = [
  {
    year: "2026",
    title: "CuraChain",
    org: "Hospital Records & Hyperledger Fabric",
    tag: "[Full-Stack · Live]",
    note: "Production EHR with Go chaincode, FastAPI, PostgreSQL & OAuth 2.0",
    href: "https://cura-chain.vercel.app/",
  },
  {
    year: "2026",
    title: "DocsBoard",
    org: "Spatial Document Workspace",
    tag: "[Frontend · Live]",
    note: "Zero-latency local-first desk for MD, PDF, JSON & TXT",
    href: "https://docs-board.vercel.app/",
  },
  {
    year: "2024",
    title: "Prodigy InfoTech",
    org: "Frontend Web Developer Intern",
    tag: "[Aug — Sep 2024]",
    note: "Responsive web interfaces, REST API integration & GSAP motion",
    href: "#contact",
  },
  {
    year: "2023—27",
    title: "Yashoda Technical Campus",
    org: "B.Tech in AI & Data Science",
    tag: "[CGPA 7.25]",
    note: "HSC Science w/ IT · Thakur Vidya Mandir ('23) / SSC ('21)",
    href: "#contact",
  },
]

const openSlots: {
  year: string
  month: string
  detail: string
  topic: ContactTopic
}[] = [
  {
    year: "2026",
    month: "Now",
    detail: "Open for Full-Stack & Frontend Internships",
    topic: "Internship / Role",
  },
  {
    year: "2026",
    month: "Q4",
    detail: "Available for freelance web & MVP builds",
    topic: "Project / MVP",
  },
  {
    year: "2027",
    month: "Grad",
    detail: "Software Engineering roles (B.Tech '27)",
    topic: "Internship / Role",
  },
  {
    year: "IST",
    month: "24h",
    detail: "Mumbai, India · Quick 15-min intro calls",
    topic: "15-min Call",
  },
]

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const menuColsVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.06,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
}

const menuColItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
  },
}

const NAV_SECTIONS = [
  { id: "top", label: "Home" },
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "notes", label: "Notes" },
  { id: "journey", label: "Journey" },
  { id: "availability", label: "Availability" },
  { id: "contact", label: "Contact" },
] as const

export default function Page() {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNavId, setActiveNavId] = useState<string>("top")
  const [activeNavLabel, setActiveNavLabel] = useState<string>("Home")
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [bookModalTopic, setBookModalTopic] =
    useState<ContactTopic>("15-min Call")
  const [activeDisc, setActiveDisc] = useState(disciplines[0].id)
  const [activeNoteIdx, setActiveNoteIdx] = useState(0)
  const [studioClock, setStudioClock] = useState("--:--")

  const openBookModal = (topic: ContactTopic = "15-min Call") => {
    setMenuOpen(false)
    setBookModalTopic(topic)
    setBookModalOpen(true)
  }

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const firstNameY = useTransform(
    heroProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -48]
  )
  const lastNameY = useTransform(
    heroProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -72]
  )
  const cardParallaxY = useTransform(
    heroProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -28]
  )

  const currentDisc =
    disciplines.find((d) => d.id === activeDisc) || disciplines[0]
  const currentNote = studioNotes[activeNoteIdx] || studioNotes[0]

  useEffect(() => {
    const syncTime = () => {
      try {
        setStudioClock(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
          }).format(new Date())
        )
      } catch {
        setStudioClock("--:--")
      }
    }
    syncTime()
    const timer = window.setInterval(syncTime, 20000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let rafId = 0

    const computeActiveSection = () => {
      rafId = 0
      const viewportTrigger = window.innerHeight * 0.36
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 72

      let matchedId = "top"
      let matchedLabel = "Home"

      if (nearBottom) {
        matchedId = "contact"
        matchedLabel = "Contact"
      } else {
        for (const sec of NAV_SECTIONS) {
          const el = document.getElementById(sec.id)
          if (!el) continue
          const rect = el.getBoundingClientRect()
          if (rect.top <= viewportTrigger) {
            matchedId = sec.id
            matchedLabel = sec.label
          }
        }
      }

      if (matchedId === "work") {
        const hash = window.location.hash.replace("#", "").toLowerCase()
        if (hash === "curachain") matchedLabel = "CuraChain"
        else if (hash === "docsboard") matchedLabel = "DocsBoard"
      }

      setActiveNavId(matchedId)
      setActiveNavLabel(matchedLabel)
    }

    const requestSync = () => {
      if (rafId !== 0) return
      rafId = window.requestAnimationFrame(computeActiveSection)
    }

    computeActiveSection()
    window.addEventListener("scroll", requestSync, { passive: true })
    window.addEventListener("resize", requestSync, { passive: true })
    window.addEventListener("hashchange", computeActiveSection)
    window.addEventListener("portfolio:section-sync", computeActiveSection)

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", requestSync)
      window.removeEventListener("resize", requestSync)
      window.removeEventListener("hashchange", computeActiveSection)
      window.removeEventListener("portfolio:section-sync", computeActiveSection)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [menuOpen])

  return (
    <div className="nk-root">
      {/* Subtle Film Grain + Continuous 4-Column Architectural Hairlines */}
      <div aria-hidden="true" className="nk-grain" />
      <div aria-hidden="true" className="nk-grid-overlay">
        <div className="nk-grid-cols">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Smooth Dim Backdrop When Navigation Drawer Is Open */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="nk-nav-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: EASE_OUT }}
          />
        )}
      </AnimatePresence>

      {/* =====================================================================
          FIXED NIKA STERN TOP NAVIGATION BAR
          ===================================================================== */}
      <header className="nk-nav-wrap">
        <div className="nk-nav-bar">
          <div className="nk-nav-left">
            <a className="nk-brand" href="#top" onClick={() => setMenuOpen(false)}>
              <span>
                Dinesh<span className="nk-brand-last"> Jadhav</span>
              </span>
              <em className="nk-slash">/</em>
              <span className="nk-page-name-clip">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    animate={{ y: 0, opacity: 1 }}
                    className="nk-page-name"
                    exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
                    initial={
                      reduceMotion ? { opacity: 0 } : { y: 12, opacity: 0 }
                    }
                    key={activeNavLabel}
                    transition={{ duration: 0.24, ease: EASE_OUT }}
                  >
                    {activeNavLabel}
                  </motion.span>
                </AnimatePresence>
              </span>
            </a>

            <button
              aria-controls="nk-menu-drawer"
              aria-expanded={menuOpen}
              className={`nk-menu-btn ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
            >
              <span aria-hidden="true" className="nk-burger">
                <i className="nk-line-1" />
                <i className="nk-line-2" />
              </span>
              <span className="nk-menu-state-roll">
                <span className="nk-menu-state-track">
                  <span>Menu</span>
                  <span>Close</span>
                </span>
              </span>
            </button>
          </div>

          <div className="nk-nav-book">
            <div className="nk-nav-status">
              <i className="nk-live-pulse" />
              <span>Open for 2026 roles</span>
            </div>
            <button
              className="nk-nav-cta"
              onClick={() => openBookModal("15-min Call")}
              type="button"
            >
              <span className="nk-dot-cream" />
              <span className="nk-roll">
                <span>Book a call</span>
                <span aria-hidden="true">Say hello</span>
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      clipPath: "inset(0% 0% 0% 0% round 12px)",
                    }
              }
              aria-label="Site directory"
              className="nk-menu-drawer"
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: -8,
                      scale: 0.99,
                      clipPath: "inset(0% 0% 100% 0% round 12px)",
                      transition: {
                        duration: 0.32,
                        ease: [0.4, 0, 0.2, 1],
                      },
                    }
              }
              id="nk-menu-drawer"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: -10,
                      scale: 0.985,
                      clipPath: "inset(0% 0% 100% 0% round 12px)",
                    }
              }
              transition={{
                duration: 0.46,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.div
                animate="visible"
                className="nk-menu-cols"
                exit="exit"
                initial="hidden"
                variants={menuColsVariants}
              >
                <motion.div variants={menuColItemVariants}>
                  <span className="nk-menu-label">Index</span>
                  <a
                    className={activeNavId === "top" ? "is-current" : undefined}
                    href="#top"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a
                    className={
                      activeNavId === "approach" ? "is-current" : undefined
                    }
                    href="#approach"
                    onClick={() => setMenuOpen(false)}
                  >
                    [01] Approach
                  </a>
                  <a
                    className={activeNavId === "work" ? "is-current" : undefined}
                    href="#work"
                    onClick={() => setMenuOpen(false)}
                  >
                    [02] Selected work
                  </a>
                  <a
                    className={
                      activeNavId === "services" ? "is-current" : undefined
                    }
                    href="#services"
                    onClick={() => setMenuOpen(false)}
                  >
                    [03] Services &amp; Stack
                  </a>
                  <a
                    className={activeNavId === "notes" ? "is-current" : undefined}
                    href="#notes"
                    onClick={() => setMenuOpen(false)}
                  >
                    [04] Studio notes
                  </a>
                  <a
                    className={
                      activeNavId === "journey" ? "is-current" : undefined
                    }
                    href="#journey"
                    onClick={() => setMenuOpen(false)}
                  >
                    [05] Journey
                  </a>
                  <a
                    className={
                      activeNavId === "availability" ? "is-current" : undefined
                    }
                    href="#availability"
                    onClick={() => setMenuOpen(false)}
                  >
                    [06] Availability
                  </a>
                  <a
                    className={
                      activeNavId === "contact" ? "is-current" : undefined
                    }
                    href="#contact"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </a>
                </motion.div>

                <motion.div variants={menuColItemVariants}>
                  <span className="nk-menu-label">Case Studies</span>
                  <a href="#curachain" onClick={() => setMenuOpen(false)}>
                    CuraChain <em>[01]</em>
                  </a>
                  <a href="#docsboard" onClick={() => setMenuOpen(false)}>
                    DocsBoard <em>[02]</em>
                  </a>
                </motion.div>

                <motion.div variants={menuColItemVariants}>
                  <span className="nk-menu-label">Connect</span>
                  <button
                    className="nk-menu-action-link"
                    onClick={() => openBookModal("15-min Call")}
                    type="button"
                  >
                    Book a call / Text me <em>[Direct]</em>
                  </button>
                  <a
                    href="https://github.com/jadhavdineshdev"
                    rel="noreferrer"
                    target="_blank"
                  >
                    GitHub <ArrowUpRight size={13} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dinesh-jadhav-8a4273309/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    LinkedIn <ArrowUpRight size={13} />
                  </a>
                  <a href={contactEmailUrl} rel="noreferrer" target="_blank">
                    Email <ArrowUpRight size={13} />
                  </a>
                </motion.div>

                <motion.div variants={menuColItemVariants}>
                  <span className="nk-menu-label">Studio</span>
                  <p>Mumbai, Maharashtra, India</p>
                  <p>{studioClock} IST · in the studio</p>
                </motion.div>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ===================================================================
            SECTION 00: EXACT NIKA STERN CRIMSON HERO (#ea2a1e)
            =================================================================== */}
        <section className="nk-hero" id="top" ref={heroRef}>
          <div className="nk-inner nk-hero-inner">
            {/* 4-Column Top Meta Row */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="nk-hero-meta"
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              <div>[ Full-stack &amp; AI ]</div>
              <div>Independent</div>
              <div>Mumbai, IN</div>
              <div className="nk-meta-work">
                <a href="#work">Selected work [02]</a>
              </div>
            </motion.div>

            {/* Middle Hero Composition: First Name + Disciplines + Person Card */}
            <div className="nk-hero-line1">
              <motion.h1
                animate={{ opacity: 1, y: 0 }}
                className="nk-first-name"
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                style={{ y: firstNameY }}
                transition={{ duration: 0.72, ease: EASE_OUT }}
              >
                Dinesh
                <span className="nk-mobile-lastname"> Jadhav</span>
              </motion.h1>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="nk-hero-disciplines"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.65,
                  delay: 0.1,
                  ease: EASE_OUT,
                }}
              >
                <span className="nk-disc-heading">Disciplines</span>
                <ul>
                  <li>
                    <a href="#work">
                      <span>Full-Stack</span>
                      <em>[02]</em>
                    </a>
                  </li>
                  <li>
                    <a href="#curachain">
                      <span>Blockchain EHR</span>
                      <em>[01]</em>
                    </a>
                  </li>
                  <li>
                    <a href="#docsboard">
                      <span>Spatial UI</span>
                      <em>[01]</em>
                    </a>
                  </li>
                  <li>
                    <a href="#journey">
                      <span>AI &amp; Data</span>
                      <em>[B.Tech]</em>
                    </a>
                  </li>
                </ul>
              </motion.div>

              {/* Signature Nika Stern Cream Person Card */}
              <motion.aside
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                aria-label="Dinesh Jadhav studio card"
                className="nk-person-card"
                initial={
                  reduceMotion ? false : { opacity: 0, y: 44, skewY: 2 }
                }
                style={{ y: cardParallaxY }}
                transition={{
                  duration: 0.75,
                  delay: 0.14,
                  ease: EASE_OUT,
                }}
              >
                <div className="nk-person-photo">
                  <Image
                    alt="Dinesh Jadhav"
                    className="nk-person-img"
                    fill
                    priority
                    sizes="(max-width: 900px) 92vw, 320px"
                    src="/dinesh-portrait.jpeg"
                  />
                  <span className="nk-person-glass">Builder &apos;26</span>

                  {/* Interactive Voice Note Trigger */}
                  <div className="nk-person-voice">
                    <PortraitInteraction />
                  </div>
                </div>

                <div className="nk-person-body">
                  <div className="nk-person-who">
                    <strong>Studio of one</strong>
                    <span>Interfaces, APIs and verifiable systems</span>
                  </div>

                  <div className="nk-person-facts">
                    <div>
                      <span>[ On the desk ]</span>
                      <p>CuraChain &amp; DocsBoard</p>
                    </div>
                    <div>
                      <span>[ Method ]</span>
                      <p>Clean UI, FastAPI &amp; Fabric</p>
                    </div>
                    <div>
                      <span>[ Briefs ]</span>
                      <p>English, Hindi or Marathi</p>
                    </div>
                  </div>

                  <div className="nk-person-status-bar">
                    <i className="nk-dot-red" />
                    <span className="nk-person-reply">
                      Direct mail or WhatsApp
                    </span>
                    <button
                      className="nk-person-cta"
                      onClick={() => openBookModal("Quick Hello")}
                      type="button"
                    >
                      <span className="nk-dot-cream" />
                      <span>Write a note</span>
                    </button>
                  </div>
                </div>
              </motion.aside>
            </div>

            {/* Bottom Hero Row: Tagline Left + Giant Last Name Right */}
            <div className="nk-hero-bottom">
              <div className="nk-hero-subcopy">
                <span>Independent engineering work</span>
                <strong>Full-stack &amp; AI</strong>
                <p>
                  Web applications, blockchain ledgers and tactile tools from
                  Mumbai.
                </p>
              </div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="nk-last-name"
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                style={{ y: lastNameY }}
                transition={{
                  duration: 0.75,
                  delay: 0.18,
                  ease: EASE_OUT,
                }}
              >
                Jadhav
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            [ 01 ] APPROACH — SCROLL-LINKED REVEAL ON #ea2a1e
            =================================================================== */}
        <section className="nk-section nk-approach-section" id="approach">
          <div className="nk-inner nk-row-layout">
            <motion.div
              className="nk-head-label"
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              viewport={{ once: false, amount: 0.4 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              [ 01 ] Approach
            </motion.div>

            <div className="nk-approach-content">
              <NikaScrollReveal
                accentWords={["question", "architecture", "motion", "trust"]}
                text="Every useful product begins with a real question. Clean architecture, tactile motion and cryptographic trust give software its point of view. A quiet detail, a fast response and an interface that stays with you."
              />

              <motion.div
                className="nk-approach-details"
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                transition={{ duration: 0.65, ease: EASE_OUT }}
                viewport={{ once: false, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p>
                  I&apos;m Dinesh, from Mumbai. I&apos;m studying Artificial
                  Intelligence and Data Science at Yashoda Technical Campus, and I
                  learn best by making software that has to work outside a
                  classroom.
                </p>
                <p>
                  A studio of one—from my first weather dashboard at Prodigy
                  InfoTech, to the local-first speed of DocsBoard, and now
                  CuraChain.
                </p>
              </motion.div>

              <motion.a
                className="nk-btn-ink"
                href="#journey"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT }}
                viewport={{ once: false, amount: 0.4 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="nk-dot-cream" />
                <span>More about me</span>
              </motion.a>
            </div>
          </div>
        </section>

        {/* ===================================================================
            [ 02 ] SELECTED WORK — CASE STUDIES & LIVE DEPLOYMENTS
            =================================================================== */}
        <ZacharyWorkSection />

        {/* ===================================================================
            [ 03 ] SERVICES — WARM CREAM (#f8f3f0) 4-TAB DISCIPLINE STAGE
            =================================================================== */}
        <section className="nk-services-section" id="services">
          <div className="nk-inner">
            <motion.div
              className="nk-head is-on-cream"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
              viewport={{ once: false, amount: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="nk-head-label">[ 03 ] Services</div>
              <div className="nk-head-body">
                <h2 className="nk-h2">What I do</h2>
                <p className="nk-lead">
                  Four connected disciplines. Each project finds its own balance
                  of interface craft, API speed, cryptographic security, and data.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="nk-stage-grid"
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              transition={{ duration: 0.7, delay: 0.06, ease: EASE_OUT }}
              viewport={{ once: false, amount: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div
                aria-label="Disciplines"
                className="nk-stage-tabs"
                role="tablist"
              >
                {disciplines.map((d) => {
                  const active = d.id === activeDisc
                  return (
                    <button
                      aria-selected={active}
                      className={`nk-stage-tab ${active ? "is-active" : ""}`}
                      key={d.id}
                      onClick={() => setActiveDisc(d.id)}
                      role="tab"
                      type="button"
                    >
                      <div className="nk-stage-tab-top">
                        <span>{d.index}</span>
                        <em>{d.count}</em>
                      </div>
                      <strong>{d.title}</strong>
                      <i className="nk-stage-tab-rule" />
                    </button>
                  )
                })}
              </div>

              <div className="nk-stage-sheet" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="nk-stage-card"
                    exit={{ opacity: 0, y: -8 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    key={currentDisc.id}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="nk-stage-card-head">
                      <span className="nk-stage-project">
                        {currentDisc.projectTitle}
                      </span>
                      <span className="nk-stage-pill">
                        {currentDisc.projectTag}
                      </span>
                    </div>

                    <p className="nk-stage-summary">{currentDisc.summary}</p>

                    <div className="nk-stage-stack">
                      <span className="nk-mono-label">[ Working stack ]</span>
                      <div className="nk-stage-chips">
                        {currentDisc.tools.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="nk-stage-bottom">
                      <div>
                        <span className="nk-mono-label">[ Deliverables ]</span>
                        <ul className="nk-stage-deliv">
                          {currentDisc.deliverables.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <a
                        className="nk-btn-ink"
                        href={currentDisc.ctaHref}
                        rel={
                          currentDisc.ctaHref.startsWith("http")
                            ? "noreferrer"
                            : undefined
                        }
                        target={
                          currentDisc.ctaHref.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                      >
                        <span className="nk-dot-red" />
                        <span>{currentDisc.ctaLabel}</span>
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===================================================================
            [ 04 ] STUDIO NOTES — INSET #151111 INK PANEL ON #ea2a1e
            =================================================================== */}
        <section className="nk-notes-outer" id="notes">
          <motion.div
            className="nk-ink-panel"
            initial={reduceMotion ? false : { opacity: 0, y: 44, scale: 0.985 }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
            viewport={{ once: false, amount: 0.12 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="nk-inner">
              <motion.div
                className="nk-head is-on-ink"
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                viewport={{ once: false, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="nk-head-label">[ 04 ] Studio notes</div>
                <div className="nk-head-body">
                  <h2 className="nk-h2">Field notes</h2>
                </div>
              </motion.div>

              <div className="nk-notes-grid">
                <div className="nk-notes-list">
                  {studioNotes.map((item, idx) => (
                    <button
                      className={`nk-note-tab ${idx === activeNoteIdx ? "is-active" : ""}`}
                      key={item.num}
                      onClick={() => setActiveNoteIdx(idx)}
                      type="button"
                    >
                      <span>{item.num}</span>
                      <em>{item.category}</em>
                      <strong>{item.title}</strong>
                    </button>
                  ))}
                </div>

                <div className="nk-note-quote-box">
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      key={currentNote.num}
                      transition={{ duration: 0.22 }}
                    >
                      <blockquote>&ldquo;{currentNote.quote}&rdquo;</blockquote>
                      <div className="nk-note-author">
                        <div>
                          <strong>Dinesh Jadhav</strong>
                          <span>{currentNote.role}</span>
                        </div>
                        <a className="nk-btn-red" href={currentNote.href}>
                          <span className="nk-dot-cream" />
                          <span>Read more</span>
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Exact Nika Stern Split Digit Counters */}
              <div className="nk-counters-row">
                {[
                  {
                    d1: "0",
                    d2: "2",
                    copy: "Shipped full-stack & local-first flagship builds live on the web.",
                  },
                  {
                    d1: "0",
                    d2: "4",
                    copy: "Disciplines connecting React UI, FastAPI, Hyperledger Fabric, and AI.",
                  },
                  {
                    d1: "0",
                    d2: "1",
                    copy: "One point of contact, from the first notebook sketch to deployment.",
                  },
                ].map((c, idx) => (
                  <motion.div
                    className="nk-counter-item"
                    initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                    key={c.d2}
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.1,
                      ease: EASE_OUT,
                    }}
                    viewport={{ once: false, amount: 0.3 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="nk-counter-digits">
                      <span>{c.d1}</span>
                      <span>{c.d2}</span>
                    </div>
                    <p>{c.copy}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===================================================================
            [ 05 ] JOURNEY & MILESTONES — ARCHITECTURAL ROWS
            =================================================================== */}
        <section className="nk-journey-section" id="journey">
          <div className="nk-inner">
            <motion.div
              className="nk-head is-on-cream"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
              viewport={{ once: false, amount: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="nk-head-label">[ 05 ] Journey</div>
              <div className="nk-head-body">
                <h2 className="nk-h2">Milestones</h2>
                <p className="nk-lead">
                  Internships, university engineering, and shipped milestones from
                  Mumbai and Satara.
                </p>
              </div>
            </motion.div>

            <div className="nk-award-list">
              {journeyRows.map((row, idx) => (
                <motion.a
                  className="nk-award-row"
                  href={row.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  key={row.title}
                  rel={row.href.startsWith("http") ? "noreferrer" : undefined}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.07,
                    ease: EASE_OUT,
                  }}
                  viewport={{ once: false, amount: 0.2 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span className="nk-award-year">{row.year}</span>
                  <strong className="nk-award-title">{row.title}</strong>
                  <span className="nk-award-org">{row.org}</span>
                  <span className="nk-award-note">{row.note}</span>
                  <span className="nk-award-tag">{row.tag}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            [ 06 ] AVAILABILITY — OPEN WINDOWS ON #ea2a1e
            =================================================================== */}
        <section className="nk-section nk-avail-section" id="availability">
          <div className="nk-inner">
            <motion.div
              className="nk-head"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
              viewport={{ once: false, amount: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="nk-head-label">[ 06 ] Availability</div>
              <div className="nk-head-body">
                <div className="nk-head-title-row">
                  <h2 className="nk-h2">Open slots</h2>
                  <button
                    className="nk-btn-ink"
                    onClick={() => openBookModal("15-min Call")}
                    type="button"
                  >
                    <span className="nk-dot-cream" />
                    <span>Book a call</span>
                  </button>
                </div>
                <p className="nk-lead">
                  Open for software engineering internships, full-stack roles, and
                  select product builds. Tap any window to reach out directly.
                </p>
              </div>
            </motion.div>

            <div className="nk-slots-grid">
              {openSlots.map((slot, idx) => (
                <motion.button
                  className="nk-slot-tile is-interactive"
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 32, scale: 0.97 }
                  }
                  key={`${slot.year}-${slot.month}`}
                  onClick={() => openBookModal(slot.topic)}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.08,
                    ease: EASE_OUT,
                  }}
                  type="button"
                  viewport={{ once: false, amount: 0.2 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <div className="nk-slot-head">
                    <span>{slot.year}</span>
                    <i className="nk-slot-dot" />
                  </div>
                  <strong>{slot.month}</strong>
                  <p>{slot.detail}</p>
                  <span className="nk-slot-cta">
                    Book this slot <ArrowUpRight size={12} />
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="nk-slots-legend">
              <span>
                <i className="is-open" /> Available window · tap to book
              </span>
              <span>Mumbai, India · IST (UTC+5:30)</span>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          CLEAN INSET #151111 INK FOOTER PANEL (NO DUPLICATE MENU DUMP)
          ===================================================================== */}
      <footer className="nk-footer-outer" id="contact">
        <motion.div
          className="nk-footer-panel"
          initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.985 }}
          transition={{ duration: 0.75, ease: EASE_OUT }}
          viewport={{ once: false, amount: 0.1 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
        >
          <div className="nk-inner">
            {/* Top Direct Contact Row */}
            <motion.div
              className="nk-footer-contact"
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
              viewport={{ once: false, amount: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="nk-footer-intro">
                <span className="nk-mono-label is-light">[ Contact ]</span>
                <p>
                  Have a role, product idea, or quick question? Mail or text me
                  directly — briefs welcome in English, Hindi or Marathi.
                </p>
              </div>

              <div className="nk-footer-mail-col">
                <a
                  className="nk-footer-email"
                  href={contactEmailUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>dineshjadhavdev@gmail.com</span>
                  <i className="nk-email-bar" />
                </a>

                <div className="nk-footer-actions">
                  <button
                    className="nk-btn-red"
                    onClick={() => openBookModal("15-min Call")}
                    type="button"
                  >
                    <span className="nk-dot-cream" />
                    <span>Book a call / Text me</span>
                  </button>
                  <a
                    className="nk-footer-phone"
                    href="https://wa.me/918010857355"
                    rel="noreferrer"
                    target="_blank"
                  >
                    WhatsApp · +91 80108 57355
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Minimal Studio & Social Strip (No Repeated Menu Links) */}
            <div className="nk-footer-meta-strip">
              <div className="nk-footer-studio-line">
                <i className="nk-live-pulse" />
                <span>Mumbai, Maharashtra, India</span>
                <em>·</em>
                <span className="nk-footer-live-clock">
                  <strong>{studioClock}</strong> IST
                </span>
              </div>

              <div className="nk-footer-socials">
                <a
                  href="https://github.com/jadhavdineshdev"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>GitHub</span>
                  <ArrowUpRight size={13} />
                </a>
                <a
                  href="https://www.linkedin.com/in/dinesh-jadhav-8a4273309/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight size={13} />
                </a>
                <a href="#top">
                  <span>Back to top ↑</span>
                </a>
              </div>
            </div>

            {/* Monumental Nika Stern Edge-to-Edge Display Name */}
            <div className="nk-clip-reveal">
              <motion.div
                aria-hidden="true"
                className="nk-footer-wordmark"
                initial={reduceMotion ? false : { y: "65%", opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                viewport={{ once: false, amount: 0.25 }}
                whileInView={{ y: "0%", opacity: 1 }}
              >
                Dinesh Jadhav
              </motion.div>
            </div>

            {/* Bottom Legal / Font Colophon */}
            <div className="nk-footer-legal">
              <span>© 2026 Dinesh Jadhav. All rights reserved</span>
              <span>Mumbai, India</span>
              <span>Set in Geist, Geist Mono</span>
            </div>
          </div>
        </motion.div>
      </footer>

      {/* Interactive Book a Call / Direct Mail & WhatsApp Modal */}
      <BookCallModal
        initialTopic={bookModalTopic}
        onClose={() => setBookModalOpen(false)}
        open={bookModalOpen}
      />
    </div>
  )
}
