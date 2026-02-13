import { NextRequest } from 'next/server'

const RATE_LIMIT = 20 // requests per minute
const WINDOW_MS = 60 * 1000 // 60 seconds

const requestMap = new Map<string, number[]>()

export function getClientIp(request: NextRequest): string {
  // Try to get IP from CF-Connecting-IP (Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp
  }
  
  // Try to get IP from X-Forwarded-For
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    // Split on commas and take first IP
    return xForwardedFor.split(',')[0].trim()
  }
  
  // Fallback to remote address (may be IPv6 loopback)
  return request.ip || '127.0.0.1'
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  
  // Get all requests for this IP in the current window
  const requests = requestMap.get(ip) || []
  const validRequests = requests.filter(timestamp => timestamp > windowStart)
  
  if (validRequests.length >= RATE_LIMIT) {
    // Calculate reset time
    const oldestRequest = validRequests[0]
    const reset = oldestRequest + WINDOW_MS
    
    return {
      allowed: false,
      remaining: 0,
      reset: Math.ceil((reset - now) / 1000)
    }
  }
  
  // Add current request timestamp
  validRequests.push(now)
  requestMap.set(ip, validRequests)
  
  return {
    allowed: true,
    remaining: RATE_LIMIT - validRequests.length,
    reset: Math.ceil(WINDOW_MS / 1000)
  }
}

export function clearRateLimit(ip: string): void {
  requestMap.delete(ip)
}
