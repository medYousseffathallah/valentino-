## Mistral Configuration
- Model: open-mistral-nemo (production), open-mistral-nemo (fallback)
- API: Use @mistralai/mistralai SDK (not fetch directly)
- Temperature: 0.8 (creative but coherent)
- Max tokens: 250 (enough for 12 lines + title)
- Response format: JSON mode with schema {title: string, poem: string}
- Streaming: Required for typewriter animation (stream: true)
## API Configuration (Zero-Cost)
- Provider: Groq (groq.com)
- Model: mixtral-8x7b-32768 (primary) or llama-3.1-70b-versatile (fallback)
- SDK: Use 'groq-sdk' (OpenAI-compatible)
- Temperature: 0.9 (more creative for poetry)
- Max tokens: 300
- Rate limit handling: If 429 error, queue retry with 1s backoff (max 2 retries)

## Environment Variables
- GROQ_API_KEY (free tier, no credit card needed)
- No OPENAI_API_KEY (we're not using OpenAI)

## Prompt Template
```json
{
  "role": "system",
  "content": "You are a poetic assistant that generates short poems in the style of {style}. Each poem should have a title and exactly 12 lines. Use the following schema for responses: {title: string, poem: string}."
}
