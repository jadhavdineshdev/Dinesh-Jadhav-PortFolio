"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FileCode,
  FileText,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from "lucide-react"

export interface ProjectData {
  id: string
  number: string
  title: string
  subtitle: string
  repository: string
  liveUrl?: string
  status: "Live" | "In progress"
  category: string
  period: string
  intro: string
  details: string[]
  stack: string[]
  stats: { label: string; value: string }[]
}

const portfolioProjects: ProjectData[] = [
  {
    id: "healthchain",
    number: "01",
    title: "HealthChain",
    subtitle: "Private by Design / Consent Architecture",
    repository: "https://github.com/jadhavdineshdev/Cura-Chain",
    status: "In progress",
    category: "FULL-STACK · HEALTH TECH",
    period: "FEB 2026 — PRESENT",
    intro:
      "A decentralized healthcare records platform where patients maintain sovereign control over who accesses their medical history, backed by tamper-evident Hyperledger Fabric integrity proofs.",
    details: [
      "Built dedicated role-based portals for patients, licensed physicians, and system administrators with cryptographically signed session verification.",
      "Added patient-controlled granular consent gates: permissions can be scoped to specific clinical files and revoked instantly.",
      "Kept sensitive high-volume clinical data off-chain while anchoring immutable SHA-256 integrity roots to Hyperledger Fabric peers.",
      "Integrated Google OAuth 2.0 with doctor license verification pipelines.",
    ],
    stack: [
      "React",
      "Node.js",
      "Express",
      "Hyperledger Fabric",
      "Docker",
      "Tailwind CSS",
      "SHA-256",
    ],
    stats: [
      { label: "CONSENSUS", value: "Raft / Fabric" },
      { label: "SECURITY", value: "Zero Plaintext On-Chain" },
      { label: "ACCESS", value: "Revocable Role-Based ACL" },
    ],
  },
  {
    id: "docsboard",
    number: "02",
    title: "DocsBoard",
    subtitle: "Loose Ends Desk / Interactive Workspace",
    repository: "https://github.com/jadhavdineshdev/DocsBoard",
    liveUrl: "https://docs-board.vercel.app/",
    status: "Live",
    category: "FRONTEND · WORKSPACE TOOL",
    period: "JUN 2026 — AUG 2026",
    intro:
      "An interactive spatial document board designed for collecting documents, organizing loose ends, and instantly picking up where you left off with zero cloud lag.",
    details: [
      "Engineered multi-format document ingestion supporting Markdown, PDF, JSON, and plain text with instant client-side parsing up to 2 MB.",
      "Built local-first persistence via structured localStorage for zero-latency instant board restore.",
      "Crafted tactile drag-and-drop spatial layouts with Motion and GSAP physics springs across desktop and mobile.",
      "Designed an adaptive dark mode theme with clean architectural visual balance.",
    ],
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
  },
]

export function ZacharyWorkSection() {
  // viewMode: "canvas" (initial home page index) or "case-study" (deep editorial view)
  const [viewMode, setViewMode] = useState<"canvas" | "case-study">("canvas")
  const [activeId, setActiveId] = useState<string>("healthchain")
  const [consentGranted, setConsentGranted] = useState(true)
  const [copiedHash, setCopiedHash] = useState(false)
  const [activeDoc, setActiveDoc] = useState<string>("sprint")
  const [scrollProgress, setScrollProgress] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const caseStudyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  const currentProject =
    portfolioProjects.find((p) => p.id === activeId) || portfolioProjects[0]

  // Listen to hash on load or change (e.g. #healthchain or #docsboard opens case study)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase()
      if (hash === "healthchain" || hash === "docsboard") {
        setActiveId(hash)
        setViewMode("case-study")
      } else if (hash === "work") {
        // Keep canvas view
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // GSAP Animations
  useEffect(() => {
    if (typeof window === "undefined") return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (viewMode === "canvas") {
        // Canvas cards entrance
        gsap.fromTo(
          ".za-canvas-card",
          { opacity: 0, y: 36, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.14,
            ease: "power2.out",
          }
        )
      } else {
        // Case study media stream stagger entrance with ScrollTrigger
        const items = gsap.utils.toArray<HTMLElement>(".za-project-item")
        items.forEach((item) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 42,
              scale: 0.98,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                end: "top 40%",
                toggleActions: "play none none reverse",
              },
            }
          )

          // Subtle parallax on inner visual content
          const visual = item.querySelector(".za-parallax-inner")
          if (visual) {
            gsap.fromTo(
              visual,
              { yPercent: -3 },
              {
                yPercent: 3,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              }
            )
          }
        })

        // Scroll progress tracker for sticky sidebar
        if (caseStudyRef.current) {
          ScrollTrigger.create({
            trigger: caseStudyRef.current,
            start: "top top+=90",
            end: "bottom bottom",
            onUpdate: (self) => {
              setScrollProgress(Math.round(self.progress * 100))
              if (progressLineRef.current) {
                progressLineRef.current.style.transform = `scaleY(${self.progress})`
              }
            },
          })
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [viewMode, activeId])

  // Open case study from canvas card
  const openCaseStudy = (projectId: string) => {
    setActiveId(projectId)
    window.history.replaceState(null, "", `#${projectId}`)

    if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setViewMode("case-study")
          window.scrollTo({
            top: (sectionRef.current?.offsetTop || 0) - 20,
            behavior: "smooth",
          })
        },
      })
    } else {
      setViewMode("case-study")
    }
  }

  // Close case study and return to canvas
  const closeCaseStudy = () => {
    window.history.replaceState(null, "", "#work")

    if (caseStudyRef.current) {
      gsap.to(caseStudyRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          setViewMode("canvas")
          window.scrollTo({
            top: (sectionRef.current?.offsetTop || 0) - 20,
            behavior: "smooth",
          })
        },
      })
    } else {
      setViewMode("canvas")
    }
  }

  // Switch between projects while inside case study
  const switchProject = (newId: string) => {
    if (newId === activeId) return

    const stream = document.querySelector(".za-media-stream")
    if (stream) {
      gsap.to(stream, {
        opacity: 0,
        y: 12,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setActiveId(newId)
          window.history.replaceState(null, "", `#${newId}`)
          gsap.fromTo(
            stream,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.04 }
          )
        },
      })
    } else {
      setActiveId(newId)
      window.history.replaceState(null, "", `#${newId}`)
    }
  }

  const copyHashValue = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  return (
    <section className="za-work-container page-width" id="work" ref={sectionRef}>
      {/* =========================================================================
          VIEW 1: PROJECTS CANVAS (ZACHARY ALLOTT HOME PAGE STYLE)
          ========================================================================= */}
      {viewMode === "canvas" && (
        <div className="za-canvas-view" ref={canvasRef}>
          {/* Section Heading & Overline */}
          <div className="za-canvas-header">
            <div className="za-header-meta">
              <span className="za-overline">SELECTED WORK · 2026</span>
              <h2 className="za-heading">
                Projects &amp; <span>Case Studies.</span>
              </h2>
            </div>
            <p className="za-canvas-tagline">
              Click any project to explore its full architectural case study, interactive models, and engineering retrospective.
            </p>
          </div>

          {/* Interactive Project Canvas Cards Grid */}
          <div className="za-canvas-grid">
            {portfolioProjects.map((project) => (
              <article
                className={`za-canvas-card za-card-${project.id}`}
                key={project.id}
                onClick={() => openCaseStudy(project.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openCaseStudy(project.id)
                  }
                }}
              >
                {/* Card Top Meta */}
                <div className="za-card-topbar">
                  <span className="za-card-num">{project.number}</span>
                  <span className="za-card-category">{project.category}</span>
                  <span
                    className={`za-status-dot ${
                      project.status === "Live" ? "is-live" : "is-progress"
                    }`}
                  />
                </div>

                {/* Card Interactive Visual Stage */}
                <div className="za-card-stage">
                  {project.id === "healthchain" ? (
                    <div className="za-stage-healthchain">
                      <div className="za-stage-pill">
                        <ShieldCheck size={13} />
                        <span>HYPERLEDGER FABRIC INTEGRITY</span>
                      </div>
                      <div className="za-stage-lockbox">
                        <Lock size={22} />
                        <span>PATIENT CONSENT GATEWAY</span>
                      </div>
                      <div className="za-stage-hash">
                        <span>SHA-256</span>
                        <code>e3b0c44298fc1c14...</code>
                      </div>
                    </div>
                  ) : (
                    <div className="za-stage-docsboard">
                      <div className="za-stage-browser-bar">
                        <span className="za-mini-dots"><i /><i /><i /></span>
                        <span className="za-mini-url">docs-board.vercel.app</span>
                        <span className="za-mini-live">LIVE</span>
                      </div>
                      <div className="za-stage-image-wrap">
                        <Image
                          alt="DocsBoard Workspace Preview"
                          className="za-stage-img"
                          height={300}
                          src="/docsboard-preview.png"
                          width={520}
                        />
                      </div>
                    </div>
                  )}

                  {/* Hover "Open Case Study" Curtain */}
                  <div className="za-card-hover-cue">
                    <span className="za-hover-btn">
                      <span>View Case Study</span>
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>

                {/* Card Footer Content */}
                <div className="za-card-footer">
                  <div className="za-card-titles">
                    <h3 className="za-card-title">{project.title}</h3>
                    <p className="za-card-sub">{project.subtitle}</p>
                  </div>

                  <p className="za-card-intro">{project.intro}</p>

                  <div className="za-card-stack-row">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span className="za-stack-pill" key={tech}>
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="za-stack-pill is-more">
                        +{project.stack.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="za-card-cta">
                    <span>Explore Case Study</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: CASE STUDY VIEW (ZACHARY ALLOTT /work/nixon-the-dork STYLE)
          ========================================================================= */}
      {viewMode === "case-study" && (
        <div className="za-case-study-view" ref={caseStudyRef}>
          {/* Top Bar Navigation: Back button + Switcher */}
          <div className="za-study-topbar">
            <button
              className="za-back-btn"
              onClick={closeCaseStudy}
              type="button"
            >
              <ArrowLeft size={14} />
              <span>All Projects</span>
            </button>

            {/* Quick Switcher Tabs */}
            <div className="za-study-tabs">
              {portfolioProjects.map((p) => {
                const isActive = p.id === activeId
                return (
                  <button
                    className={`za-study-tab ${isActive ? "is-active" : ""}`}
                    key={p.id}
                    onClick={() => switchProject(p.id)}
                    type="button"
                  >
                    <span className="za-tab-index">{p.number}</span>
                    <span>{p.title}</span>
                  </button>
                )
              })}
            </div>

            <button
              aria-label="Close Case Study"
              className="za-close-icon-btn"
              onClick={closeCaseStudy}
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Two-Column Zachary Allott Layout */}
          <div className="za-case-study-grid">
            {/* Left Column: Sticky Project Metadata */}
            <aside className="za-sticky-sidebar">
              <div className="za-sidebar-inner">
                {/* Vertical Reading Progress Bar */}
                <div aria-hidden="true" className="za-progress-track">
                  <div className="za-progress-fill" ref={progressLineRef} />
                </div>

                <div className="za-meta-block">
                  <div className="za-project-index">
                    <span>{currentProject.number}</span>
                    <span className="za-divider">/</span>
                    <span>CASE STUDY</span>
                  </div>

                  <h3 className="za-title">{currentProject.title}</h3>
                  <p className="za-subtitle">{currentProject.subtitle}</p>

                  <div className="za-status-pill">
                    <span
                      className={`za-status-dot ${
                        currentProject.status === "Live"
                          ? "is-live"
                          : "is-progress"
                      }`}
                    />
                    <span>{currentProject.status}</span>
                    <span className="za-status-period">
                      · {currentProject.period}
                    </span>
                  </div>

                  <p className="za-description">{currentProject.intro}</p>

                  {/* Architecture & Tech Stack Tags */}
                  <div className="za-services-wrap">
                    <span className="za-services-label">STACK &amp; ARCHITECTURE</span>
                    <ul className="za-services-list">
                      {currentProject.stack.map((item) => (
                        <li className="za-service-pill" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Engineering Specs */}
                  <div className="za-specs-list">
                    {currentProject.stats.map((stat) => (
                      <div className="za-spec-item" key={stat.label}>
                        <span className="za-spec-label">{stat.label}</span>
                        <span className="za-spec-value">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* External Links */}
                  <div className="za-actions-group">
                    {currentProject.liveUrl && (
                      <a
                        className="za-primary-action"
                        href={currentProject.liveUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>Launch Live Website</span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                    <a
                      className="za-secondary-action"
                      href={currentProject.repository}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Code2 size={15} />
                      <span>Inspect Source Code</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>

                  {/* Next Project Switcher Trigger */}
                  <div className="za-switch-prompt">
                    <button
                      className="za-next-trigger"
                      onClick={() =>
                        switchProject(
                          activeId === "healthchain" ? "docsboard" : "healthchain"
                        )
                      }
                      type="button"
                    >
                      <span>Next Case Study</span>
                      <strong>
                        {activeId === "healthchain" ? "DocsBoard" : "HealthChain"}
                      </strong>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column: Rhythmic Asymmetrical Media Stream */}
            <div className="za-media-stream">
              {activeId === "healthchain" ? (
                <HealthChainMediaStream
                  consentGranted={consentGranted}
                  copiedHash={copiedHash}
                  onCopyHash={copyHashValue}
                  onToggleConsent={() => setConsentGranted(!consentGranted)}
                />
              ) : (
                <DocsBoardMediaStream
                  activeDoc={activeDoc}
                  onSelectDoc={setActiveDoc}
                />
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="za-study-bottom-nav">
            <button
              className="za-bottom-return"
              onClick={closeCaseStudy}
              type="button"
            >
              <ArrowLeft size={14} />
              <span>Return to Projects Index</span>
            </button>

            <button
              className="za-bottom-next"
              onClick={() => {
                switchProject(
                  activeId === "healthchain" ? "docsboard" : "healthchain"
                )
                window.scrollTo({
                  top: (sectionRef.current?.offsetTop || 0) + 40,
                  behavior: "smooth",
                })
              }}
              type="button"
            >
              <span>Next Project:</span>
              <strong>
                {activeId === "healthchain" ? "DocsBoard" : "HealthChain"} →
              </strong>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

/* -------------------------------------------------------------
 * HEALTHCHAIN MEDIA STREAM (Rhythmic Asymmetrical Layout)
 * -----------------------------------------------------------*/
function HealthChainMediaStream({
  consentGranted,
  onToggleConsent,
  copiedHash,
  onCopyHash,
}: {
  consentGranted: boolean
  onToggleConsent: () => void
  copiedHash: boolean
  onCopyHash: (hash: string) => void
}) {
  const sampleHash =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

  return (
    <>
      {/* 1. HERO VIEW (78% width, right-aligned) */}
      <article className="za-project-item za-item-hero" id="healthchain">
        <div className="za-item-badge">
          <span>01.1</span> / CLINICAL CONSENT GATEWAY
        </div>
        <div className="za-parallax-inner">
          <div className="za-interactive-frame">
            <div className="za-frame-bar">
              <div className="za-frame-brand">
                <span className="za-brand-cross">+</span>
                <strong>HEALTHCHAIN</strong>
                <span className="za-brand-channel">channel/care-records</span>
              </div>
              <div className="za-frame-tag">
                <ShieldCheck size={13} />
                <span>HIPAA-COMPLIANT OFF-CHAIN LEDGER</span>
              </div>
            </div>

            <div className="za-frame-body">
              <div className="za-record-header">
                <div>
                  <span className="za-overline-mini">PATIENT SOVEREIGNTY VIEW</span>
                  <h4>Cardiology &amp; Diagnostic Records</h4>
                </div>
                <button
                  aria-pressed={consentGranted}
                  className={`za-consent-switch ${
                    consentGranted ? "is-granted" : "is-revoked"
                  }`}
                  onClick={onToggleConsent}
                  type="button"
                >
                  <span className="za-switch-dot" />
                  <span>
                    {consentGranted ? "Access Granted" : "Revoked by Patient"}
                  </span>
                </button>
              </div>

              <div className="za-access-card">
                <div className="za-access-avatar">
                  <FileText size={18} />
                </div>
                <div className="za-access-copy">
                  <strong>Dr. Chen — Chief of Cardiology</strong>
                  <p>
                    {consentGranted
                      ? "Ephemeral read permission active. Verified license #MED-40291."
                      : "Access disabled. Doctor cannot view raw medical data."}
                  </p>
                </div>
                <span
                  className={`za-access-indicator ${
                    consentGranted ? "is-active" : ""
                  }`}
                >
                  {consentGranted ? <Check size={14} /> : <Lock size={14} />}
                </span>
              </div>

              <div className="za-proof-strip">
                <span className="za-proof-pulse" />
                <span className="za-proof-label">SHA-256 STATE MERKLE ROOT:</span>
                <code className="za-proof-hash">{sampleHash.slice(0, 24)}...</code>
                <span className="za-proof-status">COMMITTED TO FABRIC PEER</span>
              </div>
            </div>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 1.1:</strong> Live consent gateway. Patients revoke or grant diagnostic record access with instant cryptographic effect.
        </div>
      </article>

      {/* 2. FULL-BLEED ARCHITECTURE SHOWCASE (100% width) */}
      <article className="za-project-item za-item-fullbleed">
        <div className="za-item-badge">
          <span>01.2</span> / DECENTRALIZED DATA FLOW TOPOLOGY
        </div>
        <div className="za-parallax-inner">
          <div className="za-architecture-canvas">
            <div className="za-arch-header">
              <span className="za-arch-tag">SYSTEM BLUEPRINT</span>
              <h5>Off-Chain Storage with Hyperledger Fabric State Anchoring</h5>
            </div>

            <div className="za-pipeline-grid">
              <div className="za-pipe-step">
                <span className="za-step-num">01</span>
                <div className="za-step-icon">
                  <ShieldCheck size={20} />
                </div>
                <h6>Patient Device</h6>
                <p>
                  Client initiates encrypted record transmission via TLS 1.3 with AES-256 GCM.
                </p>
              </div>

              <div className="za-pipe-connector">
                <span className="za-arrow">→</span>
              </div>

              <div className="za-pipe-step">
                <span className="za-step-num">02</span>
                <div className="za-step-icon">
                  <Database size={20} />
                </div>
                <h6>Encrypted Vault (Off-Chain)</h6>
                <p>
                  Heavy clinical imaging and vitals kept off-chain to maintain privacy &amp; performance.
                </p>
              </div>

              <div className="za-pipe-connector">
                <span className="za-arrow">→</span>
              </div>

              <div className="za-pipe-step">
                <span className="za-step-num">03</span>
                <div className="za-step-icon">
                  <Cpu size={20} />
                </div>
                <h6>Fabric Chaincode</h6>
                <p>
                  Endorsing peers validate license ACL &amp; record cryptographic hash to the ledger.
                </p>
              </div>
            </div>

            <div className="za-arch-callouts">
              <div className="za-callout-pill">
                <Check size={12} /> Zero Plaintext Storage on Public Ledger
              </div>
              <div className="za-callout-pill">
                <Check size={12} /> Raft Byzantine Fault Tolerance
              </div>
              <div className="za-callout-pill">
                <Check size={12} /> Tamper-Proof Audit Trail
              </div>
            </div>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 1.2:</strong> Dual-tier system topology separating protected health information (PHI) storage from immutable blockchain verification.
        </div>
      </article>

      {/* 3. OFFSET DETAIL CARD (56% width, right-aligned) */}
      <article className="za-project-item za-item-offset">
        <div className="za-item-badge">
          <span>01.3</span> / CRYPTOGRAPHIC PROOF
        </div>
        <div className="za-parallax-inner">
          <div className="za-hash-card">
            <div className="za-hash-header">
              <Lock size={16} />
              <span>Block #4092 Verification</span>
            </div>
            <div className="za-hash-content">
              <span className="za-hash-label">STATE MERKLE ROOT:</span>
              <div className="za-hash-codeblock">
                <code>{sampleHash}</code>
                <button
                  className="za-copy-btn"
                  onClick={() => onCopyHash(sampleHash)}
                  title="Copy SHA-256 Hash"
                  type="button"
                >
                  {copiedHash ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <div className="za-hash-meta">
                <span>PEERS: 3/3 VALIDATED</span>
                <span>STATUS: COMMITTED</span>
              </div>
            </div>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 1.3:</strong> SHA-256 hash verified across all endorsing peers.
        </div>
      </article>

      {/* 4. CODE & CHAINCODE ENGINEERING (84% width) */}
      <article className="za-project-item za-item-wide">
        <div className="za-item-badge">
          <span>01.4</span> / CHAINCODE &amp; DOCKER SPECS
        </div>
        <div className="za-parallax-inner">
          <div className="za-code-frame">
            <div className="za-code-bar">
              <span className="za-dots"><i /><i /><i /></span>
              <span className="za-code-file">records_contract.go — Fabric Smart Contract</span>
              <Terminal size={14} />
            </div>
            <pre className="za-code-block">
              <code>{`// VerifyConsent verifies doctor license & active patient permission
func (c *ConsentContract) VerifyConsent(ctx contractapi.TransactionContextInterface, patientID string, doctorID string) (bool, error) {
    consentKey, err := ctx.GetStub().CreateCompositeKey("Consent", []string{patientID, doctorID})
    if err != nil {
        return false, fmt.Errorf("failed to generate composite key: %v", err)
    }
    consentBytes, err := ctx.GetStub().GetState(consentKey)
    if consentBytes == nil || err != nil {
        return false, nil // Consent revoked or non-existent
    }
    var record ConsentRecord
    json.Unmarshal(consentBytes, &record)
    return record.IsActive && record.ExpiresAt > time.Now().Unix(), nil
}`}</code>
            </pre>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 1.4:</strong> Smart contract policy enforcing atomic permission validation before data exchange.
        </div>
      </article>

      {/* 5. OUTCOMES & BUILD NOTES (100% width) */}
      <article className="za-project-item za-item-fullbleed">
        <div className="za-item-badge">
          <span>01.5</span> / RETROSPECTIVE &amp; LESSONS
        </div>
        <div className="za-takeaway-card">
          <div className="za-takeaway-grid">
            <div className="za-takeaway-block">
              <span className="za-takeaway-num">01</span>
              <h5>Decentralized State Isolation</h5>
              <p>
                Storing raw medical documents directly on a distributed ledger is both cost-prohibitive and a severe HIPAA liability. Anchoring SHA-256 integrity proofs to the chain while keeping encrypted blobs in off-chain object storage gave us privacy without sacrificing integrity.
              </p>
            </div>
            <div className="za-takeaway-block">
              <span className="za-takeaway-num">02</span>
              <h5>Docker &amp; Node Orchestration</h5>
              <p>
                Managing the raft orderer, certificate authority, and multiple peer nodes via Docker Compose taught me the intricacies of container networking and PKI infrastructure.
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

/* -------------------------------------------------------------
 * DOCSBOARD MEDIA STREAM (Rhythmic Asymmetrical Layout)
 * -----------------------------------------------------------*/
function DocsBoardMediaStream({
  activeDoc,
  onSelectDoc,
}: {
  activeDoc: string
  onSelectDoc: (id: string) => void
}) {
  const docs = [
    {
      id: "sprint",
      name: "Q4_Sprint_Board.md",
      type: "MARKDOWN",
      size: "18 KB",
      preview:
        "### Sprint Goals\n- Drag and drop physics via GSAP springs\n- Local-first indexed recovery\n- Dark mode architectural tokens",
    },
    {
      id: "brief",
      name: "Product_Architecture.pdf",
      type: "PDF / DOCUMENT",
      size: "1.4 MB",
      preview:
        "Architectural blueprint detailing zero-cloud latency, local persistence algorithms, and client-side format ingestion.",
    },
    {
      id: "schema",
      name: "workspace_schema.json",
      type: "JSON / DATA",
      size: "4 KB",
      preview:
        '{\n  "version": "2.4.0",\n  "storage": "localStorage",\n  "syncLatencyMs": 0.4\n}',
    },
    {
      id: "notes",
      name: "Loose_Ends.txt",
      type: "MEMO / NOTES",
      size: "2 KB",
      preview:
        "Things to keep in mind:\n- Keyboard shortcuts for board zoom\n- Export to ZIP option\n- Preserve file tags across reloads",
    },
  ]

  const currentDoc = docs.find((d) => d.id === activeDoc) || docs[0]

  return (
    <>
      {/* 1. HERO VIEW (78% width, right-aligned) */}
      <article className="za-project-item za-item-hero" id="docsboard">
        <div className="za-item-badge">
          <span>02.1</span> / SPATIAL DOCUMENT DESK
        </div>
        <div className="za-parallax-inner">
          <div className="za-interactive-frame za-docsboard-frame">
            <div className="za-frame-bar">
              <span className="za-dots"><i /><i /><i /></span>
              <span className="za-frame-url">
                <ExternalLink size={12} />
                docs-board.vercel.app
              </span>
              <span className="za-live-chip">LIVE DEPLOYMENT</span>
            </div>

            <div className="za-docs-viewport">
              <Image
                alt="DocsBoard live interface showing spatial document cards"
                className="za-preview-img"
                height={540}
                priority
                src="/docsboard-preview.png"
                width={960}
              />
              <div className="za-img-overlay">
                <a
                  className="za-preview-link"
                  href="https://docs-board.vercel.app/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>Explore Live Board</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 2.1:</strong> Live DocsBoard workspace running client-side with instant drag and drop organization.
        </div>
      </article>

      {/* 2. FULL-BLEED INTERACTIVE DESK (100% width) */}
      <article className="za-project-item za-item-fullbleed">
        <div className="za-item-badge">
          <span>02.2</span> / MULTI-FORMAT DOCUMENT INGESTION
        </div>
        <div className="za-parallax-inner">
          <div className="za-desk-showcase">
            <div className="za-desk-header">
              <span className="za-arch-tag">INTERACTIVE BOARD PREVIEW</span>
              <h5>Click any document to inspect client-side parsing &amp; properties:</h5>
            </div>

            <div className="za-docs-selector">
              {docs.map((doc) => (
                <button
                  className={`za-doc-chip ${
                    activeDoc === doc.id ? "is-active" : ""
                  }`}
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  type="button"
                >
                  <FileCode size={14} />
                  <span>{doc.name}</span>
                  <small>{doc.size}</small>
                </button>
              ))}
            </div>

            <div className="za-doc-inspector">
              <div className="za-doc-info-bar">
                <span className="za-doc-type">{currentDoc.type}</span>
                <span className="za-doc-status">PARSED VIA BROWSER FileReader API</span>
              </div>
              <pre className="za-doc-preview-content">
                <code>{currentDoc.preview}</code>
              </pre>
            </div>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 2.2:</strong> Zero-cloud document parsing engine handling 4 distinct format pipelines up to 2 MB in browser RAM.
        </div>
      </article>

      {/* 3. OFFSET DETAIL CARD (56% width, right-aligned) */}
      <article className="za-project-item za-item-offset">
        <div className="za-item-badge">
          <span>02.3</span> / LOCAL-FIRST PERSISTENCE
        </div>
        <div className="za-parallax-inner">
          <div className="za-metrics-card">
            <div className="za-metric-row">
              <span className="za-metric-num">0.4ms</span>
              <span className="za-metric-label">BOARD RESTORE TIME</span>
            </div>
            <div className="za-metric-divider" />
            <div className="za-metric-row">
              <span className="za-metric-num">0 KB</span>
              <span className="za-metric-label">CLOUD EGRESS / ZERO TELEMETRY</span>
            </div>
            <p className="za-metric-copy">
              All notes, positions, and attachments remain strictly in browser localStorage.
            </p>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 2.3:</strong> Offline-first performance benchmarks.
        </div>
      </article>

      {/* 4. MOTION & GSAP INTERACTION ENGINE (84% width) */}
      <article className="za-project-item za-item-wide">
        <div className="za-item-badge">
          <span>02.4</span> / SPRING PHYSICS &amp; GSAP ENGINE
        </div>
        <div className="za-parallax-inner">
          <div className="za-physics-card">
            <div className="za-physics-visual">
              <div className="za-spring-node is-a" />
              <div className="za-spring-connector" />
              <div className="za-spring-node is-b" />
            </div>
            <div className="za-physics-copy">
              <h6>Tactile Gesture Ergonomics</h6>
              <p>
                Used custom spring curves with damped harmonic bounce (`stiffness: 190, damping: 24`) to give document cards physical weight as users fling, stack, and pin items across the infinite canvas.
              </p>
              <div className="za-physics-tags">
                <span>gsap.quickTo()</span>
                <span>Inertia Physics</span>
                <span>GPU-Accelerated Matrix3d</span>
              </div>
            </div>
          </div>
        </div>
        <div className="za-item-caption">
          <strong>Figure 2.4:</strong> Kinetic physics modeling giving desktop-app tactile responsiveness to web surfaces.
        </div>
      </article>

      {/* 5. OUTCOMES & REPOSITORY (100% width) */}
      <article className="za-project-item za-item-fullbleed">
        <div className="za-item-badge">
          <span>02.5</span> / RETROSPECTIVE &amp; SHIP NOTE
        </div>
        <div className="za-takeaway-card">
          <div className="za-takeaway-grid">
            <div className="za-takeaway-block">
              <span className="za-takeaway-num">01</span>
              <h5>Empathy for the Blank Canvas</h5>
              <p>
                Most productivity apps drown you in menus and logins before you write a single word. DocsBoard was designed around immediate readiness: open the URL, drop a file, and start thinking.
              </p>
            </div>
            <div className="za-takeaway-block">
              <span className="za-takeaway-num">02</span>
              <h5>Vite &amp; React Architecture</h5>
              <p>
                Keeping the bundle ultra-lean (sub-120 KB gzip) allowed near-instantaneous first contentful paint (FCP) even on spotty cellular connections.
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
