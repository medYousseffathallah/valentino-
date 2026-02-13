export function encodeBase64UrlUtf8(value: string) {
  if (typeof window === "undefined") {
    return Buffer.from(value, "utf8").toString("base64url")
  }
  const bytes = new TextEncoder().encode(value)
  let binary = ""
  for (const b of bytes) binary += String.fromCharCode(b)
  const base64 = btoa(binary)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export function decodeBase64UrlUtf8(value: string) {
  if (typeof window === "undefined") {
    return Buffer.from(value, "base64url").toString("utf8")
  }
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function encodeJsonParam<T>(obj: T) {
  return encodeBase64UrlUtf8(JSON.stringify(obj))
}

export function decodeJsonParam<T>(param: string): T | null {
  try {
    const json = decodeBase64UrlUtf8(param)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

