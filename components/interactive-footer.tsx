"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUp } from "lucide-react"
import PixelFlowField from "@/components/smoothui/pixel-flow-field"

export function InteractiveFooter() {
  const [scatterCount, setScatterCount] = useState(0)
  const footerRef = useRef<HTMLElement>(null)

  // Automatically trigger scatter when user comes near the footer while scrolling
  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Blow particles apart into organic flow field as user approaches
            setScatterCount((prev) => prev + 1)
          }
        })
      },
      {
        // Triggers 200px before the footer reaches the viewport
        rootMargin: "200px 0px 0px 0px",
        threshold: 0.05,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      className="footer-flow-wrapper"
      id="footer-section"
      ref={footerRef}
    >
      {/* Full Viewport Height Pixel Flow Field Canvas */}
      <div className="footer-stage-container">
        <PixelFlowField
          cellSize={8}
          className="footer-flow-canvas"
          colors={[
            "rgba(18, 19, 18, 0.06)", // Dim ambient field dots
            "rgba(18, 19, 18, 0.28)", // Swirling flow vectors
            "rgba(18, 19, 18, 0.92)", // Solid rasterized "DINESH" dots
          ]}
          gap={3}
          pointerRadius={150}
          pointerStrength={1}
          scatter={scatterCount}
          shape="circle"
          speed={0.95}
          text="DINESH"
          weight={900}
        >
          {/* Bottom Colophon Bar Overlaid on Canvas */}
          <div className="footer-canvas-bottom-bar page-width">
            <a
              aria-label="Dinesh Jadhav, return to top"
              className="wordmark footer-wordmark"
              href="#home"
              onClick={scrollToTop}
            >
              <span aria-hidden="true" className="wordmark-mark">
                <Image alt="" fill sizes="32px" src="/dinesh-portrait.jpeg" />
              </span>
              <span className="wordmark-copy">
                <span className="wordmark-name">Dinesh Jadhav</span>
                <span className="wordmark-role">Builder &amp; Note-Taker</span>
              </span>
            </a>

            <div className="footer-colophon">
              <span>Mumbai, India © 2026</span>
            </div>

            <a
              aria-label="Back to the top"
              className="footer-back-to-top"
              href="#home"
              onClick={scrollToTop}
            >
              <span>Back to the top</span>
              <ArrowUp size={13} />
            </a>
          </div>
        </PixelFlowField>
      </div>
    </footer>
  )
}
