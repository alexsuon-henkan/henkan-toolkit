import type React from "react"
import type { Metadata } from "next"
import { Inter, Libre_Baskerville } from "next/font/google"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { Sidebar } from "@/components/Sidebar"
import { TopNav } from "@/components/TopNav"
import { Footer } from "@/components/Footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { Suspense } from "react"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const libre_baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
})

export const metadata: Metadata = {
  title: "Henkan - A/B Testing Calculator Suite",
  description:
    "A comprehensive suite of A/B testing calculators, including frequentist, bayesian, duration, revenue, and AOV calculators.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${libre_baskerville.variable}`}>
      <body>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div>Loading...</div>}>
              <TopNav />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 pl-64 pt-16">
                  <div className="p-8">{children}</div>
                </main>
              </div>
              <Footer />
            </Suspense>
          </div>
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
