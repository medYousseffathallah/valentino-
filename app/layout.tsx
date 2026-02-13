import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { LenisProvider } from "@/components/valentino/LenisProvider"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Valentino",
  description: "Finger puppet poetry for the ones you love."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-stone-50 font-sans text-rose-700 antialiased">
        <LenisProvider />
        {children}
      </body>
    </html>
  )
}

