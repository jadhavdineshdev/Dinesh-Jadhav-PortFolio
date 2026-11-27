"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MessageCircle,
  PhoneCall,
  X,
} from "lucide-react"

export type ContactTopic =
  | "15-min Call"
  | "Project / MVP"
  | "Internship / Role"
  | "Quick Hello"

const TOPICS: readonly ContactTopic[] = [
  "15-min Call",
  "Project / MVP",
  "Internship / Role",
  "Quick Hello",
]

const TOPIC_PLACEHOLDERS: Record<ContactTopic, string> = {
  "15-min Call":
    "Hey Dinesh, let's jump on a quick 15-min call this week to chat about...",
  "Project / MVP":
    "Hey Dinesh, I have a web / product build in mind and would love to discuss scope...",
  "Internship / Role":
    "Hi Dinesh, reaching out regarding a Full-Stack / Software Engineering opportunity at...",
  "Quick Hello":
    "Hey Dinesh! Loved exploring your portfolio — wanted to say hi and connect...",
}

const DINESH_EMAIL = "dineshjadhavdev@gmail.com"
const DINESH_PHONE_E164 = "918010857355"
const DINESH_PHONE_DISPLAY = "+91 80108 57355"

interface BookCallModalProps {
  open: boolean
  initialTopic?: ContactTopic
  onClose: () => void
}

export function BookCallModal({
  open,
  initialTopic = "15-min Call",
  onClose,
}: BookCallModalProps) {
  const reduceMotion = useReducedMotion()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [topic, setTopic] = useState<ContactTopic>(initialTopic)
  const [name, setName] = useState("")
  const [senderContact, setSenderContact] = useState("")
  const [message, setMessage] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [sentChannel, setSentChannel] = useState<"whatsapp" | "email" | null>(
    null
  )

  useEffect(() => {
    setTopic(initialTopic)
  }, [initialTopic])

  useEffect(() => {
    if (!open) {
      setSentChannel(null)
      return
    }

    const focusTimer = window.setTimeout(() => {
      nameInputRef.current?.focus()
    }, 120)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  const buildComposedText = () => {
    const cleanName = name.trim() || "Someone from your portfolio"
    const cleanContact = senderContact.trim()
    const cleanBody =
      message.trim() ||
      `Hi Dinesh, I'd love to connect regarding: ${topic}.`

    const lines = [
      `Hi Dinesh! 👋`,
      ``,
      `Topic: ${topic}`,
      `From: ${cleanName}${cleanContact ? ` (${cleanContact})` : ""}`,
      ``,
      cleanBody,
    ]
    return lines.join("\n")
  }

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(buildComposedText())
    window.open(
      `https://wa.me/${DINESH_PHONE_E164}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    )
    setSentChannel("whatsapp")
  }

  const handleEmailSend = () => {
    const cleanName = name.trim()
    const subject = encodeURIComponent(
      `[${topic}] ${cleanName ? `${cleanName} × Dinesh Jadhav` : "Portfolio Inquiry"}`
    )
    const body = encodeURIComponent(buildComposedText())
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches

    if (isCoarsePointer) {
      window.location.href = `mailto:${DINESH_EMAIL}?subject=${subject}&body=${body}`
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(DINESH_EMAIL)}&su=${subject}&body=${body}`,
        "_blank",
        "noopener,noreferrer"
      )
    }
    setSentChannel("email")
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DINESH_EMAIL)
      setCopiedEmail(true)
      window.setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      window.location.href = `mailto:${DINESH_EMAIL}`
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          aria-labelledby="nk-book-title"
          aria-modal="true"
          className="nk-modal-root"
          role="dialog"
        >
          <motion.div
            animate={{ opacity: 1 }}
            className="nk-modal-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
          />

          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="nk-book-card"
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 18, scale: 0.96 }
            }
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.95 }
            }
            transition={{
              duration: reduceMotion ? 0.1 : 0.34,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Header Bar */}
            <div className="nk-book-top">
              <div className="nk-book-eyebrow">
                <i className="nk-live-pulse" />
                <span>[ DIRECT LINE · MUMBAI IST ]</span>
              </div>
              <button
                aria-label="Close contact dialog"
                className="nk-book-close"
                onClick={onClose}
                type="button"
              >
                <X size={15} />
              </button>
            </div>

            <div className="nk-book-heading">
              <h2 id="nk-book-title">Book a call or drop a text</h2>
              <p>
                Pick a topic and reach me directly on WhatsApp or email —
                usually replies within a few hours.
              </p>
            </div>

            {/* Interactive Topic Chips */}
            <div
              aria-label="Inquiry topic"
              className="nk-book-chips"
              role="radiogroup"
            >
              {TOPICS.map((item) => {
                const active = topic === item
                return (
                  <button
                    aria-checked={active}
                    className={`nk-book-chip ${active ? "is-active" : ""}`}
                    key={item}
                    onClick={() => setTopic(item)}
                    role="radio"
                    type="button"
                  >
                    {active && <span className="nk-dot-red" />}
                    <span>{item}</span>
                  </button>
                )
              })}
            </div>

            {/* Compact Catchy Form */}
            <form
              className="nk-book-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleWhatsAppSend()
              }}
            >
              <div className="nk-book-row">
                <label className="nk-book-field">
                  <span>[ Your name ]</span>
                  <input
                    autoComplete="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex / Team"
                    ref={nameInputRef}
                    type="text"
                    value={name}
                  />
                </label>

                <label className="nk-book-field">
                  <span>[ Email or handle ]</span>
                  <input
                    autoComplete="email"
                    onChange={(e) => setSenderContact(e.target.value)}
                    placeholder="you@company.com"
                    type="text"
                    value={senderContact}
                  />
                </label>
              </div>

              <label className="nk-book-field">
                <span>[ Quick note ]</span>
                <textarea
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={TOPIC_PLACEHOLDERS[topic]}
                  rows={3}
                  value={message}
                />
              </label>

              {/* Dual Direct Send Buttons: Text (WhatsApp) + Mail */}
              <div className="nk-book-actions">
                <button
                  className="nk-book-send is-whatsapp"
                  onClick={handleWhatsAppSend}
                  type="button"
                >
                  <MessageCircle size={15} />
                  <span>Text me on WhatsApp</span>
                  <ArrowUpRight size={14} />
                </button>

                <button
                  className="nk-book-send is-email"
                  onClick={handleEmailSend}
                  type="button"
                >
                  <Mail size={15} />
                  <span>Mail me directly</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </form>

            {sentChannel && (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="nk-book-feedback"
                initial={{ opacity: 0, y: 4 }}
              >
                <Check size={13} />
                <span>
                  {sentChannel === "whatsapp"
                    ? "Opened WhatsApp with your note — hit send there!"
                    : "Opened your mail composer with your note ready!"}
                </span>
              </motion.p>
            )}

            {/* Quick Copy / Direct Call Strip */}
            <div className="nk-book-foot">
              <button
                className="nk-book-mini-link"
                onClick={handleCopyEmail}
                type="button"
              >
                {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedEmail ? "Email copied!" : DINESH_EMAIL}</span>
              </button>

              <a
                className="nk-book-mini-link"
                href={`tel:+${DINESH_PHONE_E164}`}
              >
                <PhoneCall size={12} />
                <span>{DINESH_PHONE_DISPLAY}</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
