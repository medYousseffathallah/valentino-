import * as React from "react"
import * as QRCode from "qrcode"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
}

export function ShareModal({ open, onOpenChange, url }: Props) {
  const [copied, setCopied] = React.useState(false)
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    let cancelled = false
    QRCode.toDataURL(url, { margin: 1, width: 192 })
      .then((data: string) => {
        if (!cancelled) setQrDataUrl(data)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })
    return () => {
      cancelled = true
    }
  }, [open, url])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  async function nativeShare() {
    if (!("share" in navigator)) return
    try {
      await navigator.share({ title: "Valentino", url })
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-auto left-1/2 bottom-0 max-w-lg translate-y-0 -translate-x-1/2 rounded-t-2xl border-b-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border-b">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Encoded in the URL. No accounts, no storage.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input readOnly value={url} onFocus={(e) => e.currentTarget.select()} />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={copy} className="w-full sm:w-auto">
              {copied ? "Copied" : "Copy Link"}
            </Button>
            {"share" in navigator ? (
              <Button type="button" variant="outline" onClick={nativeShare} className="w-full sm:w-auto">
                Open Share
              </Button>
            ) : null}
          </div>

          {qrDataUrl ? (
            <div className="flex items-center justify-center rounded-lg border border-stone-200 bg-stone-50 p-4">
              <img src={qrDataUrl} alt="QR code for the share link" className="h-40 w-40" />
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
