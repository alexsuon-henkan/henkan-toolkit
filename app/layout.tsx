import "../styles/globals.css"
import { Inter, Libre_Baskerville } from "next/font/google"
import { TopNav } from "../components/TopNav"
import { AuthProvider } from "@/contexts/AuthContext"
import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import Sidebar from "@/components/Sidebar"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre",
})

const version = "3.5"

export const metadata: Metadata = {
  title: {
    default: "Henkan Toolkit",
    template: "%s | Henkan Toolkit",
  },
  description: "Powerful statistical tools and data visualization for informed decision-making.",
  keywords: ["A/B testing", "statistical analysis", "data visualization", "calculator"],
  authors: [{ name: "Henkan Toolkit Team" }],
  creator: "Henkan Toolkit",
  publisher: "Henkan Toolkit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.henkantoolkit.com"),
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${libreBaskerville.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#4CAF50" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#4CAF50" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#4CAF50" />
      </head>
      <body className="min-h-screen bg-white">
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <TopNav />
            <div className="flex">
              <Sidebar />
              <main className="w-full pl-16 mt-16">{children}</main>
            </div>
            <Analytics />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
