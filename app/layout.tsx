import type { Metadata, Viewport } from "next"
import { Montserrat, Poppins } from "next/font/google"

import "./globals.css"
import "lenis/dist/lenis.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import PagePreloader from "@/components/smoothui/components/smoothui/page-preloader"
import { cn } from "@/lib/utils"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dineshjadhav.dev"

export const viewport: Viewport = {
  themeColor: "#181919",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dinesh Jadhav — Builder & Note-Taker | Frontend & Full-Stack Developer",
    template: "%s | Dinesh Jadhav",
  },
  description:
    "Personal portfolio and engineering case studies of Dinesh Jadhav: learning, architectural projects, and lessons from building thoughtful web interfaces in Mumbai, India.",
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
    "Tailwind CSS",
    "GSAP",
    "Hyperledger Fabric",
    "HealthChain",
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
    siteName: "Dinesh Jadhav Portfolio",
    title: "Dinesh Jadhav — Builder & Note-Taker | Frontend & Full-Stack Developer",
    description:
      "Personal portfolio of Dinesh Jadhav. Exploring decentralized architectures, local-first UX, and modern web interfaces from Mumbai, India.",
    images: [
      {
        url: "/dinesh-portrait.jpeg",
        width: 800,
        height: 800,
        alt: "Dinesh Jadhav — Builder & Note-Taker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinesh Jadhav — Builder & Note-Taker",
    description:
      "Frontend & Full-Stack Developer based in Mumbai. Building HealthChain, DocsBoard, and interactive web experiences.",
    images: ["/dinesh-portrait.jpeg"],
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

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
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
        montserrat.variable,
        poppins.variable,
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
          <PagePreloader
            background="bg-[#f7f6f2]"
            duration={4200}
            variant="words"
            words={[
              "Curiosity, kept alive",
              "Ideas, built by hand",
              "The story keeps unfolding",
            ]}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
