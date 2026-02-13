import { NextResponse, type NextRequest } from "next/server"

export const config = {
  matcher: ["/api/poem"]
}

type Bucket = {
  windowStartMs: number
  count: number
}

const WINDOW_MS = 60_000
const LIMIT = 5

const rateLimitStore = new Map<string, Bucket>()

function getStore() {
  return rateLimitStore
}

function getIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown"
  return req.ip ?? "unknown"
}

export function middleware(req: NextRequest) {
  const ip = getIp(req)
  const now = Date.now()
  const store = getStore()
  const current = store.get(ip)

  if (!current || now - current.windowStartMs >= WINDOW_MS) {
    store.set(ip, { windowStartMs: now, count: 1 })
    return NextResponse.next()
  }

  if (current.count >= LIMIT) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    )
  }

  current.count += 1
  store.set(ip, current)
  return NextResponse.next()
}
