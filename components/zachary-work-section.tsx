"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Code2,
  ExternalLink,
  ImageIcon,
  X,
} from "lucide-react"

export interface ProjectScreen {
  id: string
  step: string
  title: string
  caption: string
  imageSrc?: string
}

export interface ProjectData {
  id: string
  number: string
  title: string
  subtitle: string
  coverImage: string
  repository: string
  liveUrl?: string
  status: "Live" | "In progress"
  category: string
  year: string
  tag: string
  period: string
  intro: string
  stack: string[]
  stats: { label: string; value: string }[]
  screens: ProjectScreen[]
}

const portfolioProjects: ProjectData[] = [
  {
    id: "curachain",
    number: "01",
    title: "CuraChain",
    subtitle: "Dual-Layer EHR / Patient Consent & Blockchain Ledger",
    coverImage: "/projects/curachain-homepage.jpg",
    repository: "https://github.com/jadhavdineshdev/CuraChain",
    liveUrl: "https://cura-chain.vercel.app/",
    status: "Live",
    category: "Blockchain EHR",
    year: "[2026]",
    tag: "Hyperledger Fabric",
    period: "2026 — PRESENT",
    intro:
      "A secure hospital records management system backed by Hyperledger Fabric 2.5—combining encrypted off-chain clinical storage with real-time SHA-256 verification, two-tier physician NPI governance, and patient-controlled doctor access.",
    stack: [
      "React",
      "FastAPI",
      "Python",
      "Hyperledger Fabric",
      "Go Chaincode",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "Tailwind CSS",
    ],
    stats: [
      { label: "ARCHITECTURE", value: "Dual-Layer EHR + Fabric" },
      { label: "CONSENT", value: "Time-Limited Revocable ACL" },
      { label: "GOVERNANCE", value: "Two-Tier NPI + MSP Cert" },
    ],
    screens: [
      {
        id: "curachain-homepage",
        step: "01",
        title: "Homepage",
        caption:
          "Public entry portal introducing decentralized clinical health records and Hyperledger Fabric 2.5 verification.",
        imageSrc: "/projects/curachain-homepage.jpg",
      },
      {
        id: "curachain-patient",
        step: "02",
        title: "Patient Health Portal",
        caption:
          "Patients sync the ledger, upload encrypted clinical documents, and track 100% zero-PHI blockchain integrity on curachain-channel.",
        imageSrc: "/projects/curachain-patient.png",
      },
      {
        id: "curachain-doctor",
        step: "03",
        title: "Doctor Clinical Dashboard",
        caption:
          "NPI-verified physicians issue new EHRs and review patient-granted records with live expiration timers and anchored status.",
        imageSrc: "/projects/curachain-doctor.png",
      },
      {
        id: "curachain-admin",
        step: "04",
        title: "Admin Governance & Doctor Verification",
        caption:
          "Hospital Node Administrator console combining automatic CMS/NPI registry checks with manual Hyperledger MSP certification.",
        imageSrc: "/projects/curachain-admin.jpg",
      },
    ],
  },
  {
    id: "docsboard",
    number: "02",
    title: "DocsBoard",
    subtitle: "Loose Ends Desk / Spatial Document Workspace",
    coverImage: "/projects/docsboard-dark.png",
    repository: "https://github.com/jadhavdineshdev/DocsBoard",
    liveUrl: "https://docs-board.vercel.app/",
    status: "Live",
    category: "Workspace Tool",
    year: "[2026]",
    tag: "Local-First",
    period: "JUN 2026 — AUG 2026",
    intro:
      "An interactive spatial document board designed for collecting documents, dragging cards freely across the desk, and instantly picking up where you left off with zero cloud lag.",
    stack: [
      "React",
      "Vite",
      "JavaScript",
      "Tailwind CSS",
      "Motion",
      "GSAP",
      "Local-First",
    ],
    stats: [
      { label: "LATENCY", value: "< 1ms Retrieval" },
      { label: "FORMATS", value: "MD · PDF · JSON · TXT" },
      { label: "STORAGE", value: "Local-First Persistent" },
    ],
    screens: [
      {
        id: "docsboard-dark",
        step: "01",
        title: "Interactive Document Canvas",
        caption:
          "Draggable floating document cards with color-coded quick download actions and instant client-side storage.",
        imageSrc: "/projects/docsboard-dark.png",
      },
      {
        id: "docsboard-workspace",
        step: "02",
        title: "Workspace Overview",
        caption:
          "Spatial document desk organizing notes and files locally in the browser with zero login friction.",
        imageSrc: "/docsboard-preview.png",
      },
    ],
  },
]

export function ZacharyWorkSection() {
  const [viewMode, setViewMode] = useState<"canvas" | "case-study">("canvas")
  const [activeId, setActiveId] = useState<string>("curachain")

  const sectionRef = useRef<HTMLElement>(null)
  const caseStudyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const currentProject =
    portfolioProjects.find((p) => p.id === activeId) || portfolioProjects[0]

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase()
      if (hash === "curachain" || hash === "healthchain") {
        setActiveId("curachain")
        setViewMode("case-study")
      } else if (hash === "docsboard") {
        setActiveId("docsboard")
        setViewMode("case-study")
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)
    const isDesktop = window.matchMedia("(min-width: 769px)").matches

    const ctx = gsap.context(() => {
      if (viewMode === "canvas") {
        const tiles = gsap.utils.toArray<HTMLElement>(".nk-work-tile")
        tiles.forEach((tile, idx) => {
          gsap.fromTo(
            tile,
            { opacity: 0, y: 54, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              delay: (idx % 2) * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: tile,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          )

          const media = tile.querySelector<HTMLElement>(".nk-parallax-media")
          if (media) {
            if (isDesktop) {
              gsap.fromTo(
                media,
                { yPercent: -4 },
                {
                  yPercent: 4,
                  ease: "none",
                  scrollTrigger: {
                    trigger: tile,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.8,
                  },
                }
              )
            } else {
              gsap.set(media, { clearProps: "transform" })
            }
          }
        })
      } else {
        const cards = gsap.utils.toArray<HTMLElement>(".nk-screen-card")
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          )
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [viewMode, activeId])

  const openCaseStudy = (projectId: string) => {
    setActiveId(projectId)
    window.history.replaceState(null, "", `#${projectId}`)
    window.dispatchEvent(new Event("portfolio:section-sync"))
    setViewMode("case-study")
    window.scrollTo({
      top: (sectionRef.current?.offsetTop || 0) - 70,
      behavior: "smooth",
    })
  }

  const closeCaseStudy = () => {
    window.history.replaceState(null, "", "#work")
    window.dispatchEvent(new Event("portfolio:section-sync"))
    setViewMode("canvas")
    window.scrollTo({
      top: (sectionRef.current?.offsetTop || 0) - 70,
      behavior: "smooth",
    })
  }

  const switchProject = (newId: string) => {
    if (newId === activeId) return
    setActiveId(newId)
    window.history.replaceState(null, "", `#${newId}`)
    window.dispatchEvent(new Event("portfolio:section-sync"))
  }

  return (
    <section className="nk-section nk-work-section" id="work" ref={sectionRef}>
      <div className="nk-inner">
        {viewMode === "canvas" && (
          <div className="nk-work-canvas" ref={canvasRef}>
            {/* Exact Nika Stern 4-Column Section Header */}
            <div className="nk-head">
              <div className="nk-head-label">[ 02 ] Selected work</div>
              <div className="nk-head-body">
                <div className="nk-head-title-row">
                  <h2 className="nk-h2">Case studies</h2>
                  <span className="nk-head-year">© 2026</span>
                </div>
                <div className="nk-head-sub-row">
                  <p className="nk-lead">
                    Full-stack systems and interactive workspaces. Click a tile to
                    inspect its screens, or open the live deployment directly.
                  </p>
                  <a
                    className="nk-btn-ink"
                    href="https://github.com/jadhavdineshdev"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="nk-dot-cream" />
                    <span>All repositories</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Exact Nika Stern 4:3 Work Tiles */}
            <div className="nk-work-grid">
              {portfolioProjects.map((project) => (
                <article
                  className="nk-work-tile"
                  key={project.id}
                  onClick={() => openCaseStudy(project.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openCaseStudy(project.id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="nk-tile-core">
                    <div className="nk-tile-image-cover nk-parallax-media">
                      <Image
                        alt={`${project.title} preview`}
                        className="nk-tile-img"
                        fill
                        sizes="(max-width: 768px) 96vw, 48vw"
                        src={project.coverImage}
                      />
                    </div>

                    {/* Top-Right Glass Pill */}
                    <div className="nk-tile-glass-tag">
                      <span>{project.tag}</span>
                    </div>

                    {/* Hover Action Curtain: Case Study + Direct Live Website */}
                    <div className="nk-tile-hover-overlay">
                      <button
                        className="nk-tile-action-btn is-cream"
                        onClick={(e) => {
                          e.stopPropagation()
                          openCaseStudy(project.id)
                        }}
                        type="button"
                      >
                        <span className="nk-dot-red" />
                        <span>Case Study</span>
                        <ArrowUpRight size={14} />
                      </button>

                      {project.liveUrl && (
                        <a
                          className="nk-tile-action-btn is-red"
                          href={project.liveUrl}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="nk-dot-cream" />
                          <span>Live Website</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    {/* Exact Nika Stern Bottom-Left Floating Caption Bar */}
                    <div className="nk-tile-caption">
                      <span className="nk-dot-red" />
                      <span className="nk-tile-num">[{project.number}]</span>
                      <strong className="nk-tile-title">{project.title}</strong>
                      <span className="nk-tile-cat">{project.category}</span>
                      <span className="nk-tile-yr">{project.year}</span>
                    </div>
                  </div>

                  {/* Mobile / Quick Direct Links Below Tile */}
                  <div className="nk-tile-foot-bar">
                    <p>{project.subtitle}</p>
                    {project.liveUrl && (
                      <a
                        className="nk-tile-direct-live"
                        href={project.liveUrl}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>Live site</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            CLEAN CASE STUDY SHEET (OVERVIEW LEFT · UI IMAGES RIGHT)
            ===================================================================== */}
        {viewMode === "case-study" && (
          <div className="nk-study-sheet" ref={caseStudyRef}>
            <div className="nk-study-topbar">
              <button
                className="nk-study-back"
                onClick={closeCaseStudy}
                type="button"
              >
                <ArrowLeft size={14} />
                <span>All Projects</span>
              </button>

              <div className="nk-study-tabs">
                {portfolioProjects.map((p) => (
                  <button
                    className={`nk-study-tab ${p.id === activeId ? "is-active" : ""}`}
                    key={p.id}
                    onClick={() => switchProject(p.id)}
                    type="button"
                  >
                    <span>[{p.number}]</span>
                    <strong>{p.title}</strong>
                  </button>
                ))}
              </div>

              <button
                aria-label="Close case study"
                className="nk-study-close"
                onClick={closeCaseStudy}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <div className="nk-study-grid">
              <aside className="nk-study-sidebar">
                <span className="nk-study-index">
                  [ {currentProject.number} ] CASE STUDY
                </span>
                <h3 className="nk-study-title">{currentProject.title}</h3>
                <p className="nk-study-sub">{currentProject.subtitle}</p>
                <p className="nk-study-intro">{currentProject.intro}</p>

                <div className="nk-study-block">
                  <span className="nk-study-label">[ Stack ]</span>
                  <div className="nk-study-chips">
                    {currentProject.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="nk-study-specs">
                  {currentProject.stats.map((st) => (
                    <div className="nk-study-spec-row" key={st.label}>
                      <span>{st.label}</span>
                      <strong>{st.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="nk-study-actions">
                  {currentProject.liveUrl && (
                    <a
                      className="nk-btn-red"
                      href={currentProject.liveUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="nk-dot-cream" />
                      <span>Launch Live Website</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                  <a
                    className="nk-btn-outline"
                    href={currentProject.repository}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Code2 size={14} />
                    <span>Inspect GitHub Repo</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>

                <button
                  className="nk-study-next"
                  onClick={() =>
                    switchProject(
                      activeId === "curachain" ? "docsboard" : "curachain"
                    )
                  }
                  type="button"
                >
                  <span>Next Case Study</span>
                  <strong>
                    {activeId === "curachain" ? "DocsBoard" : "CuraChain"}
                  </strong>
                  <ChevronRight size={14} />
                </button>
              </aside>

              {/* Right Column: Simple Clean UI Screens */}
              <div className="nk-study-screens">
                {currentProject.screens.map((screen, index) => (
                  <article
                    className="nk-screen-card"
                    id={index === 0 ? currentProject.id : undefined}
                    key={screen.id}
                  >
                    <div className="nk-screen-head">
                      <div>
                        <span>[{screen.step}]</span>
                        <strong>{screen.title}</strong>
                      </div>
                      {currentProject.liveUrl && index === 0 && (
                        <a
                          href={currentProject.liveUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Open Live <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    <div className="nk-screen-media">
                      {screen.imageSrc ? (
                        <Image
                          alt={`${currentProject.title} — ${screen.title}`}
                          className="nk-screen-img"
                          height={640}
                          priority={index === 0}
                          sizes="(max-width: 1024px) 96vw, 64vw"
                          src={screen.imageSrc}
                          width={1138}
                        />
                      ) : (
                        <div className="nk-screen-slot">
                          <ImageIcon size={26} />
                          <strong>
                            {currentProject.title} · {screen.title}
                          </strong>
                          <span>UI image slot ready</span>
                        </div>
                      )}
                    </div>

                    <p className="nk-screen-caption">
                      <strong>{screen.title} —</strong> {screen.caption}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
