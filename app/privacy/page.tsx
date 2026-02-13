import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-3xl text-rose-700">Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-stone-700">
            <p className="text-base leading-7">
              We never see your data. Poems exist only in your browser.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-stone-600">
              <li>No accounts, no authentication.</li>
              <li>No database, no uploads.</li>
              <li>No names, addresses, phone numbers, or photo fields.</li>
              <li>Sharing is just an encoded URL parameter you control.</li>
            </ul>

            <div className="pt-2">
              <Button asChild>
                <Link href="/">Back to Valentino</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

