"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  ChevronDown,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { PortfolioDock } from "@/components/portfolio-dock"
import { PortraitInteraction } from "@/components/portrait-interaction"
import MagneticButton from "@/components/smoothui/magnetic-button"
import FolderReveal, {
  type FolderRevealItem,
} from "@/components/smoothui/folder-reveal"
import InfiniteSlider from "@/components/smoothui/infinite-slider"

const contactEmailUrl =
  "https://mail.google.com/mail/?view=cm&fs=1&to=dineshjadhavdev%40gmail.com"

const toolkitItems: FolderRevealItem[] = [
  {
    href: "#healthchain",
    id: "healthchain",
    content: (
      <div className="folder-stack-card">
        <span>01 / CASE FILE</span>
        <strong>HealthChain</strong>
        <small>Records, consent, and trust.</small>
      </div>
    ),
  },
  {
    href: "#docsboard",
    id: "docsboard",
    content: (
      <div className="folder-stack-card">
        <span>02 / SIDE PROJECT</span>
        <strong>DocsBoard</strong>
        <small>A desk for the loose ends.</small>
      </div>
    ),
  },
  {
    href: "#experience",
    content: (
      <div className="folder-stack-card">
        <span>03 / FIRST SHIP</span>
        <strong>Prodigy InfoTech</strong>
        <small>My first work in a team.</small>
      </div>
    ),
    id: "first-builds",
  },
  {
    href: "#stack",
    id: "working-tools",
    content: (
      <div className="folder-stack-card">
        <span>04 / IN THE TOOLBOX</span>
        <strong>What I work with</strong>
        <small>Tools I reach for, project by project.</small>
      </div>
    ),
  },
]

type PortfolioProjectDetails = {
  id: string
  number: string
  title: string
  repository: string
  category: string
  period: string
  intro: string
  details: string[]
  stack: string[]
}

type PortfolioProject = PortfolioProjectDetails &
  (
    | { status: "In progress"; liveUrl?: never }
    | { status: "Live"; liveUrl: string }
  )

const projects: PortfolioProject[] = [
  {
    id: "healthchain",
    number: "01",
    title: "HealthChain",
    repository: "https://github.com/jadhavdineshdev/Cura-Chain",
    status: "In progress",
    category: "FULL-STACK · HEALTH TECH",
    period: "FEB 2026 — PRESENT",
    intro:
      "A healthcare records platform where patients stay in control of who sees their information.",
    details: [
      "Built dedicated experiences for patients, doctors, and administrators, with role-based access and doctor license verification.",
      "Added patient-controlled record permissions and Google authentication.",
      "Kept sensitive medical data off-chain while anchoring SHA-256 integrity proofs to Hyperledger Fabric.",
    ],
    stack: [
      "React",
      "Node.js",
      "Express",
      "Hyperledger Fabric",
      "Docker",
      "Tailwind CSS",
    ],
  },
  {
    id: "docsboard",
    number: "02",
    title: "DocsBoard",
    repository: "https://github.com/jadhavdineshdev/DocsBoard",
    liveUrl: "https://docs-board.vercel.app/",
    status: "Live",
    category: "FRONTEND · DOCUMENT WORKSPACE",
    period: "JUN 2026 — AUG 2026",
    intro:
      "An interactive board for collecting documents, moving them around, and picking up where you left off.",
    details: [
      "Added document creation, upload, download, and deletion, with support for four formats up to 2 MB.",
      "Used localStorage to keep board data in the browser.",
      "Designed responsive layouts and dark mode, with Motion and GSAP interactions across mobile and desktop.",
    ],
    stack: ["React", "Vite", "JavaScript", "Tailwind CSS", "Motion", "GSAP"],
  },
]

const skillGroupNames = ["UI", "Server & data", "Build & design"] as const

const skillGroups = {
  UI: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "GSAP", "Three.js"],
  "Server & data": ["Node.js", "Express", "REST APIs", "PostgreSQL", "MongoDB"],
  "Build & design": [
    "Hyperledger Fabric",
    "Docker",
    "Git",
    "GitHub",
    "Postman",
    "Google OAuth",
    "Figma",
    "UI design",
    "Design systems",
  ],
} satisfies Record<(typeof skillGroupNames)[number], string[]>

function HealthChainPreview() {
  return (
    <div
      aria-label="HealthChain preview: patient-controlled record access and verified integrity proofs"
      className="healthchain-preview"
      role="img"
    >
      <div className="preview-toolbar">
        <div className="preview-brand">
          <span className="healthchain-mark">+</span>
          HEALTHCHAIN
        </div>
        <span className="preview-protected"><ShieldCheck size={12} /> PRIVATE BY DESIGN</span>
      </div>
      <div className="healthchain-body">
        <span className="preview-overline">PATIENT PORTAL / RECORD SHARING</span>
        <h3>Your records.<br />Your call.</h3>
        <p>Access is clear, and sharing starts with consent.</p>
        <div className="record-permission">
          <span className="permission-icon"><FileText size={15} /></span>
          <span className="permission-copy">
            <strong>Shared with your care team</strong>
            <small>Permission can be changed by you</small>
          </span>
          <span className="permission-state"><Check size={12} /></span>
        </div>
        <div className="integrity-proof">
          <span className="proof-dot" />
          <span>SHA-256 INTEGRITY PROOF</span>
          <span className="proof-ledger">HYPERLEDGER FABRIC</span>
        </div>
      </div>
    </div>
  )
}

function DocsBoardLivePreview() {
  return (
    <div className="docsboard-live-preview">
      <div aria-hidden="true" className="live-preview-glow" />
      <div className="live-preview-window">
        <div className="live-preview-toolbar">
          <span className="window-lights"><i /><i /><i /></span>
          <span className="live-preview-address">
            <span className="live-preview-lock">↗</span>
            docs-board.vercel.app
          </span>
          <span className="live-preview-live">LIVE</span>
        </div>
        <div className="live-preview-viewport">
          <Image
            alt="DocsBoard workspace with saved documents and download cards"
            className="live-preview-image"
            fill
            sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 40vw"
            src="/docsboard-preview.png"
          />
        </div>
      </div>
      <span className="live-preview-caption">A little less lost, one document at a time.</span>
    </div>
  )
}

export default function Page() {
  const reduceMotion = useReducedMotion()
  const [folderOpen, setFolderOpen] = useState(false)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [activeSkillGroup, setActiveSkillGroup] =
    useState<(typeof skillGroupNames)[number]>("UI")

  return (
    <main>
      <section className="hero page-width" id="home">
        <div className="hero-copy">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Hi, I&apos;m
            <br />
            <span className="hero-name">
              <span className="hero-name-text">Dinesh<span className="hero-period">.</span></span>
              <PortraitInteraction />
            </span>
            <br />
            I&apos;m figuring out
            <br />
            <span className="hero-highlight">how things work.</span>
          </motion.h1>
          <motion.div
            className="hero-bottom"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
          >
            <p>
              A student, developer, and chronic note-taker. This is the trail so
              far: the things I shipped, the things I&apos;m studying, and what
              each one taught me.
            </p>
            <a aria-label="Jump to selected projects" className="round-link" href="#work">
              <ArrowDown size={17} />
            </a>
          </motion.div>
          <div className="hero-contact">
            <a href={contactEmailUrl} rel="noreferrer" target="_blank">Say hello <ArrowUpRight size={13} /></a>
            <span>ENGLISH · HINDI · MARATHI</span>
          </div>
        </div>

        <motion.div
          aria-label="Interactive folder showing Dinesh's development toolkit"
          className="hero-art"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          role="group"
        >
          <div className="hero-art-glow" />
          <motion.span
            className="art-note art-note-top"
            animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [3, 5, 3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            picked for<br />the problem
          </motion.span>
          <FolderReveal
            color="terracotta"
            items={toolkitItems}
            label="MY TOOLKIT"
            onOpenChange={setFolderOpen}
            size={320}
            spread={42}
            trigger="click"
          />
          <div aria-live="polite" className="folder-hint">
            <span className="folder-hint-dot" />
            {folderOpen ? "Pick a page to follow the thread." : "Open a file. See where it takes you."}
          </div>
          <span className="art-note art-note-bottom">01 / CURRENT TOOLKIT</span>
        </motion.div>
        <div className="hero-index"><span>01</span> — A WORK IN PROGRESS</div>
      </section>

      <div
        aria-label="React, Node.js, PostgreSQL, Hyperledger Fabric, and Docker"
        className="ticker"
        role="img"
      >
        <InfiniteSlider className="ticker-slider" gap={30} speed={24} speedOnHover={12}>
          {Array.from({ length: 3 }, (_, index) => (
            <span aria-hidden="true" className="ticker-item" key={index}>
              2023 / STARTED STUDYING AI &amp; DATA <i>✳</i> 2024 / FIRST FRONTEND INTERNSHIP <i>✳</i> 2026 / BUILDING HEALTHCHAIN <i>✳</i> STILL LEARNING <i>✳</i>
            </span>
          ))}
        </InfiniteSlider>
      </div>

      <section className="work-section page-width" id="work">
        <motion.div
          className="section-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
        >
          <div>
            <h2>Each build left<br />a <span>mark.</span></h2>
          </div>
          <p>
            Some lessons came from a real problem.<br />
            Others came from making something just to learn.
          </p>
        </motion.div>

        <div className="project-list">
          {projects.map((project, index) => {
            const isExpanded = expandedProject === project.id
            const isLive = project.status === "Live"
            const projectDestination = isLive ? project.liveUrl : project.repository

            return (
              <motion.article
                className={`project-card project-${project.id}`}
                id={project.id}
                key={project.id}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.16, margin: "-8% 0px -8% 0px" }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.06 }}
              >
                <a
                  aria-label={`Open ${project.title} ${isLive ? "live website" : "source repository"}`}
                  className="project-destination"
                  href={projectDestination}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="project-visual">
                    {isLive ? (
                      <DocsBoardLivePreview />
                    ) : (
                      <HealthChainPreview />
                    )}
                  </div>
                  <div className="project-meta">
                    <span className="project-number">{project.number}</span>
                    <div className="project-info">
                      <div className="project-overline">
                        <span className="project-type">{project.category}</span>
                        <span className="project-period">{project.period}</span>
                      </div>
                      <span className={`project-status ${isLive ? "is-live" : "is-progress"}`}>
                        <i aria-hidden="true" />
                        {project.status}
                      </span>
                      <h3>{project.title}</h3>
                      <p>{project.intro}</p>
                      <div aria-label={`${project.title} technologies`} className="project-stack">
                        {project.stack.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                      <div className="project-destination-label">
                        <span>{isLive ? "Open the live project" : "Explore the source repository"}</span>
                        <ArrowUpRight aria-hidden="true" size={14} />
                      </div>
                    </div>
                  </div>
                </a>
                <div className="project-actions">
                  <a
                    aria-label={`View ${project.title} source on GitHub`}
                    href={project.repository}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Code2 aria-hidden="true" size={15} />
                    View source code
                    <ArrowUpRight aria-hidden="true" size={13} />
                  </a>
                </div>
                <button
                  aria-controls={`${project.id}-notes`}
                  aria-expanded={isExpanded}
                  className="project-toggle"
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                  type="button"
                >
                  {isExpanded ? "Close build notes" : "A few build notes"}
                  <ChevronDown aria-hidden="true" className={isExpanded ? "is-open" : ""} size={15} />
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      animate={{ height: "auto", opacity: 1 }}
                      className="project-details"
                      exit={{ height: 0, opacity: 0 }}
                      id={`${project.id}-notes`}
                      initial={{ height: 0, opacity: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { height: { type: "spring", stiffness: 190, damping: 24 }, opacity: { duration: 0.18 } }
                      }
                    >
                      <ul>
                        {project.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-inner page-width">
          <motion.div
            className="about-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <h2>I&apos;ve always wanted<br />to know what&apos;s <span>underneath.</span></h2>
            <p>
              I&apos;m Dinesh, from Mumbai. I&apos;m studying Artificial
              Intelligence and Data Science, but I learn best by making
              something that has to work outside a classroom.
            </p>
            <p>
              The path has gone from my first weather app at Prodigy InfoTech,
              to the small satisfaction of DocsBoard, and now to HealthChain.
              Each project has made me more curious about the part just below
              the surface.
            </p>
            <div className="about-traits">
              <span>COMMUNICATION</span>
              <span>PROBLEM SOLVING</span>
              <span>ALWAYS LEARNING</span>
            </div>
          </motion.div>
          <motion.div
            className="about-aside"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
          >
            <div className="about-stamp"><span>RIGHT NOW</span><strong>Making<br />trust part<br />of the UI.</strong><i>— Dinesh</i></div>
            <span className="about-aside-note">HEALTHCHAIN / 2026</span>
          </motion.div>
        </div>
      </section>

      <section className="experience-section page-width" id="experience">
        <motion.div
          className="section-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
        >
          <div>
            <h2>Learning by<br /><span>making.</span></h2>
          </div>
          <p>Two chapters, a few firsts,<br />and a city in the margins.</p>
        </motion.div>
        <div className="experience-list">
          <motion.article
            className="experience-row"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2, margin: "-8% 0px -8% 0px" }}
            transition={{ duration: reduceMotion ? 0 : 0.55 }}
            tabIndex={0}
          >
            <div className="experience-period">Aug — Sep 2024</div>
            <span className="experience-marker" />
            <div className="experience-content">
              <span className="experience-label">Internship · Remote</span>
              <h3>Frontend Web Developer Intern</h3>
              <p className="experience-company">Prodigy InfoTech <span>·</span> Mumbai, India</p>
              <p className="experience-description">
                Built two responsive frontend projects: a landing page and a
                weather app. Connected a weather API to show live information
                and shaped both interfaces for desktop and mobile.
              </p>
              <div className="experience-tools">JavaScript · React · REST APIs · GSAP · Tailwind CSS</div>
            </div>
            <ArrowUpRight aria-hidden="true" className="experience-arrow" size={18} />
            <figure aria-hidden="true" className="journey-memory journey-memory-weather">
              <div className="memory-photo memory-weather-scene">
                <span className="memory-photo-index">FIELD NOTE / 01</span>
                <strong>31°</strong>
                <span className="memory-weather-caption">Mumbai, after the rain</span>
                <i className="memory-sun" />
                <i className="memory-cloud memory-cloud-one" />
                <i className="memory-cloud memory-cloud-two" />
              </div>
              <figcaption>THE FIRST TIME AN API MADE A PAGE FEEL ALIVE</figcaption>
            </figure>
          </motion.article>
          <motion.article
            className="experience-row education-row"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2, margin: "-8% 0px -8% 0px" }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08 }}
            tabIndex={0}
          >
            <div className="experience-period">2023 — 2027</div>
            <span className="experience-marker" />
            <div className="experience-content">
              <span className="experience-label">Education · Satara, Maharashtra</span>
              <h3>B.Tech, Artificial Intelligence &amp; Data Science</h3>
              <p className="experience-company">Yashoda Technical Campus</p>
              <p className="experience-description">
                Currently studying how intelligent systems work—and building
                practical web products alongside the coursework.
              </p>
              <div className="experience-tools">CGPA <strong>7.25</strong></div>
            </div>
            <ArrowUpRight aria-hidden="true" className="experience-arrow" size={18} />
            <figure aria-hidden="true" className="journey-memory journey-memory-study">
              <div className="memory-photo memory-study-scene">
                <span className="memory-photo-index">STUDY NOTE / 02</span>
                <span className="memory-map-pin">YTC</span>
                <strong>Satara<br />to somewhere.</strong>
                <span className="memory-study-caption">AI &amp; Data Science · 2023—27</span>
                <i className="memory-study-line" />
              </div>
              <figcaption>WHERE THE QUESTIONS GOT BIGGER</figcaption>
            </figure>
          </motion.article>
        </div>
        <p className="education-footnote">
          Before campus: HSC, Science with Information Technology · Thakur Vidya Mandir (2021–2023)
          <span> / </span>
          SSC · Adv. Chandansingh Solanki School (2021)
        </p>
      </section>

      <section className="toolkit-section" id="stack">
        <div className="toolkit-inner page-width">
          <motion.div
            className="toolkit-intro"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <h2>Not a checklist.<br />A <span>working set.</span></h2>
            <p>
              I&apos;ve picked these up one project at a time. Some are familiar;
              some still have a few more tabs open.
            </p>
            <div className="stack-personal-note">
              <span>RECENTLY REACHED FOR</span>
              <strong>React <i>+</i> Node <i>+</i> a better question</strong>
              <span>THE TOOLS CHANGE. THE CURIOSITY DOESN&apos;T.</span>
            </div>
          </motion.div>
          <motion.div
            className="skill-browser"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
          >
            <div aria-label="Skill categories" className="skill-tabs" role="tablist">
              {skillGroupNames.map((group) => (
                <button
                  aria-selected={activeSkillGroup === group}
                  className={activeSkillGroup === group ? "skill-tab is-active" : "skill-tab"}
                  aria-controls="skill-panel"
                  id={`skill-tab-${group.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                  key={group}
                  onClick={() => setActiveSkillGroup(group)}
                  role="tab"
                  type="button"
                >
                  {group}
                </button>
              ))}
            </div>
            <div
              aria-labelledby={`skill-tab-${activeSkillGroup.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
              className="skill-panel"
              id="skill-panel"
              role="tabpanel"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="skill-chip-list"
                  exit={{ opacity: 0, y: -5 }}
                  initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                  key={activeSkillGroup}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                  {skillGroups[activeSkillGroup].map((skill) => (
                    <span className="skill-chip" key={skill}>{skill}</span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="skill-note">Updated whenever a project teaches me something new.</span>
          </motion.div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner page-width">
          <motion.div
            className="contact-letter"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <span className="contact-eyebrow"><span className="availability-dot" /> OPEN TO A GOOD CONVERSATION</span>
            <h2>Have a problem<br />worth <span>solving?</span></h2>
            <p>
              If you&apos;re making something useful, I&apos;d like to hear about it.
              The best work usually starts with a good question.
            </p>
            <MagneticButton
              className="contact-button"
              href={contactEmailUrl}
              rel="noreferrer"
              target="_blank"
            >
              <Mail size={16} /> Write me a note <ArrowUpRight size={16} />
            </MagneticButton>
            <div className="contact-details">
              <a href={contactEmailUrl} rel="noreferrer" target="_blank"><Mail size={14} /> dineshjadhavdev@gmail.com</a>
              <a href="tel:8010857355"><Phone size={14} /> 8010857355</a>
            </div>
            <div className="contact-postmark" aria-hidden="true">
              <span>FROM</span><strong>MUMBAI</strong><span>WITH CURIOSITY</span>
            </div>
          </motion.div>
          <div aria-label="A note for the next chapter" className="contact-ribbon">
            <InfiniteSlider className="contact-ribbon-slider" gap={22} speed={18} speedOnHover={8}>
              {Array.from({ length: 3 }, (_, index) => (
                <span aria-hidden="true" className="contact-ribbon-item" key={index}>
                  GOOD QUESTIONS <i>✳</i> USEFUL THINGS <i>✳</i> ROOM TO LEARN <i>✳</i>
                </span>
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </section>

      <footer className="site-footer page-width">
        <a aria-label="Dinesh Jadhav, back to top" className="wordmark footer-wordmark" href="#home">
          <span aria-hidden="true" className="wordmark-mark">
            <Image alt="" fill sizes="32px" src="/dinesh-portrait.jpeg" />
          </span>
          <span className="wordmark-name">Dinesh Jadhav</span>
        </a>
        <span className="footer-made">Built in Mumbai <span>·</span> © 2026</span>
        <a className="footer-top" href="#home">Back to the top <ArrowRight size={13} /></a>
      </footer>
      <PortfolioDock />
    </main>
  )
}
