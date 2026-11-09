import type { Metadata } from "next"
import { Montserrat, Poppins } from "next/font/google"

import "./globals.css"
import "lenis/dist/lenis.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import PagePreloader from "@/components/smoothui/components/smoothui/page-preloader"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dinesh Jadhav — A Journey of Learning and Building",
  description:
    "A work-in-progress journal from Dinesh Jadhav: learning, projects, and small lessons from building things in Mumbai.",
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
      <body>
        <ThemeProvider>
          <SmoothScroll />
          <PagePreloader
            background="bg-[#f2eade]"
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
