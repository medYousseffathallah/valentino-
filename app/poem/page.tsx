import type { Metadata } from "next"

import { PoemClient } from "@/app/poem/poem-client"

export const metadata: Metadata = {
  title: "Valentino — Poem",
  robots: { index: false, follow: false }
}

export default function PoemPage({ searchParams }: { searchParams: { data?: string } }) {
  return <PoemClient dataParam={searchParams.data} />
}
