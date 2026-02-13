"use client"

import { useState } from 'react'
import { Copy, Share2, Paperclip, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import QRCode from 'qrcode'
import { motion, AnimatePresence } from 'framer-motion'

interface ShareButtonProps {
  url: string
}

export function ShareButton({ url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [showPaperAirplane, setShowPaperAirplane] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Valentino Poem',
          text: 'Check out this romantic poem I created!',
          url
        })
      } else {
        await copyToClipboard()
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error)
        await copyToClipboard()
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      setShowPaperAirplane(true)
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowPaperAirplane(false)
      }, 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      setShowPaperAirplane(false)
    }
  }

  const generateQRCode = async () => {
    try {
      const qr = await QRCode.toDataURL(url)
      setQrCode(qr)
    } catch (error) {
      console.error('QR code generation failed:', error)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showPaperAirplane && (
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 text-rose-500"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0.8],
              opacity: [0, 1, 0],
              x: [0, window.innerWidth / 2 - 100],
              y: [0, -window.innerHeight / 2 + 100],
              rotate: [0, 180],
            }}
            transition={{
              duration: 1.5,
              ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Send className="w-12 h-12" />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
            <Share2 className="mr-2 h-4 w-4" />
            Keep this
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-rose-700">Keep this Poem</DialogTitle>
            <DialogDescription>
              Share this poem with your special someone using one of these methods.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm bg-stone-50"
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="bg-rose-700 hover:bg-rose-800 text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            {qrCode ? (
              <div className="flex justify-center">
                <div className="bg-stone-100 p-4 rounded-lg border border-stone-300 shadow-lg">
                  <div className="bg-white p-2 rounded">
                    <img src={qrCode} alt="QR Code" className="h-40 w-40" />
                  </div>
                  <div className="mt-2 text-center text-xs font-mono text-stone-600">
                    SCAN TO READ THE POEM
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={generateQRCode}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Generate QR Code
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleShare} className="bg-rose-700 hover:bg-rose-800 text-white">
              Share via App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
