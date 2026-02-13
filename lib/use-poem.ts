"use client"

import * as React from "react"

interface UsePoemOptions {
  onError?: (error: Error) => void
}

interface UsePoemReturn {
  generate: (data: {
    nickname: string
    relationship: string
    traits: string[]
    vibe: string
  }) => Promise<{ title: string; poem: string } | null>
  isLoading: boolean
  error: Error | null
}

export function usePoem(options: UsePoemOptions = {}): UsePoemReturn {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const generate = React.useCallback(async (data: {
    nickname: string
    relationship: string
    traits: string[]
    vibe: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/poem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const text = await response.text()
      
      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        throw new Error(`Server returned invalid JSON: ${text.slice(0, 100)}`)
      }

      if (!response.ok) {
        const errorMsg = (parsed as { error?: string })?.error || `Failed to generate poem: ${response.status}`
        throw new Error(errorMsg)
      }

      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof (parsed as Record<string, unknown>).title !== 'string' ||
        typeof (parsed as Record<string, unknown>).poem !== 'string'
      ) {
        throw new Error(`Invalid response format: ${JSON.stringify(parsed).slice(0, 100)}`)
      }

      const result = parsed as { title: string; poem: string }
      setIsLoading(false)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      setIsLoading(false)
      options.onError?.(error)
      return null
    }
  }, [options])

  return { generate, isLoading, error }
}
