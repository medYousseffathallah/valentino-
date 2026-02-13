# Valentino

Finger puppet poetry for the ones you love. Zero-PII, no accounts, no database, no uploads. All inputs live in React state and the shareable URL.

## Features

- 🎭 CSS-only finger characters (Val & Tino) with spring physics
- ✨ AI-powered romantic poetry via Groq API
- 🔒 Privacy-first: Zero database, data lives in URL
- 📱 Responsive with reduced motion support
- ⚡ 60fps cursor tracking with CSS variables

## Tech

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Framer Motion + GSAP animations
- Groq SDK (LLM streaming)
- Edge runtime (deploy-ready for Vercel)

## Local setup

1. Install dependencies

```bash
npm install
```

2. Add environment variables

Create `.env.local`:

```bash
VALENTINO_GROQ_API_KEY=your_api_key_here
```

3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

## Deploy

Set `VALENTINO_GROQ_API_KEY` in your Vercel project environment variables and deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
