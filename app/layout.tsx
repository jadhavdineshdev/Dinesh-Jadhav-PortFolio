import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import "lenis/dist/lenis.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { NikaPreloader } from "@/components/nika-preloader"
import { cn } from "@/lib/utils"

const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "https://dineshjadhav.dev"
}

const siteUrl = getSiteUrl()
const portraitUrl = `${siteUrl}/dinesh-portrait.jpeg`

export const viewport: Viewport = {
  themeColor: "#ea2a1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dinesh Jadhav — Frontend & Full-Stack Developer | Portfolio",
    template: "%s | Dinesh Jadhav",
  },
  description:
    "Hi, I'm Dinesh Jadhav — a Frontend & Full-Stack Developer and B.Tech AI & Data Science student from Mumbai, India. Building CuraChain, DocsBoard, and thoughtful interactive web products.",
  applicationName: "Dinesh Jadhav Portfolio",
  authors: [{ name: "Dinesh Jadhav", url: "https://github.com/jadhavdineshdev" }],
  generator: "Next.js",
  keywords: [
    "Dinesh Jadhav",
    "Portfolio",
    "Frontend Developer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "FastAPI",
    "Tailwind CSS",
    "GSAP",
    "Hyperledger Fabric",
    "CuraChain",
    "DocsBoard",
    "Mumbai Developer",
    "Software Engineer India",
  ],
  creator: "Dinesh Jadhav",
  publisher: "Dinesh Jadhav",
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Dinesh Jadhav — Portfolio",
    title: "Dinesh Jadhav — Frontend & Full-Stack Developer",
    description:
      "Hi, I'm Dinesh Jadhav from Mumbai, India — B.Tech AI & Data Science student and Full-Stack Developer crafting CuraChain (Hyperledger Fabric EHR), DocsBoard, and interactive web experiences.",
    images: [
      {
        url: portraitUrl,
        secureUrl: portraitUrl,
        width: 800,
        height: 800,
        type: "image/jpeg",
        alt: "Dinesh Jadhav — Frontend & Full-Stack Developer from Mumbai, India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinesh Jadhav — Frontend & Full-Stack Developer",
    description:
      "B.Tech AI & Data Science student and Full-Stack Developer from Mumbai, India. Building CuraChain, DocsBoard, and tactile web interfaces.",
    images: [
      {
        url: portraitUrl,
        alt: "Dinesh Jadhav — Frontend & Full-Stack Developer",
      },
    ],
    creator: "@dineshjadhav",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180" }],
  },
}

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
})

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Dinesh Jadhav",
      jobTitle: "Frontend & Full-Stack Developer",
      description:
        "Builder & Note-Taker crafting modern web applications and decentralized systems in Mumbai, India.",
      url: siteUrl,
      image: `${siteUrl}/dinesh-portrait.jpeg`,
      sameAs: [
        "https://github.com/jadhavdineshdev",
        "https://www.linkedin.com/in/dinesh-jadhav-8a4273309/",
      ],
      address: {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressCountry": "IN",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Hyperledger Fabric",
        "Node.js",
        "Express",
        "GSAP",
        "Full-Stack Web Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Dinesh Jadhav — Portfolio",
      description:
        "Personal portfolio, architectural case studies, and engineering journal of Dinesh Jadhav.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll />
          <CustomCursor />
          <NikaPreloader duration={1400} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
