import Groq from 'groq-sdk'

if (!process.env.VALENTINO_GROQ_API_KEY) {
  throw new Error('VALENTINO_GROQ_API_KEY is not set')
}

const groq = new Groq({
  apiKey: process.env.VALENTINO_GROQ_API_KEY
})

export { groq }
