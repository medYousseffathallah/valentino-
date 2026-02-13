import type { Metadata } from "next"
import { Suspense } from "react"

import { PoemClient } from "@/app/poem/poem-client"

export const metadata: Metadata = {
  title: "Valentino — Poem",
  robots: { index: false, follow: false }
}

export default function PoemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-stone-800 mb-4">Loading poem...</h2>
      </div>
    </div>}>
      <PoemClient />
    </Suspense>
  )
}