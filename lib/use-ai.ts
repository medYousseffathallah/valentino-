import { useCompletion, type UseCompletionOptions } from "@ai-sdk/react"

export function useAI(options: UseCompletionOptions) {
  return useCompletion({
    ...options,
    streamProtocol: 'text'
  })
}

