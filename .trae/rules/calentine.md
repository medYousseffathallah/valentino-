# Calentine Project Rules

## Architecture Constraints

- **Zero Database**: Never import Prisma, Mongoose, or Firebase. Data lives in React state + URL params only.
- **Server Components by default**: Only use 'use client' for: wizard steps, poem reveal animations, clipboard API.
- **API Routes**: All OpenAI calls MUST be in app/api/poem/route.ts (streaming only).

## Component Standards

- All UI components must use shadcn/ui base (run npx shadcn add [component] first).
- Custom components go in app/components/ with PascalCase.
- Animation wrappers go in app/components/motion/.
- No any types. All props must be typed with interfaces.

## Styling Rules

- Color palette locked to: stone-50 (bg), rose-700 (primary), amber-600 (accent), white (cards).
- Never use blue-500, red-500, or neon colors.
- Typography: Headings use font-serif (Playfair Display), body uses font-sans (Inter).
- Spacing: Use gap-6 for forms, p-8 for cards, max-w-md for wizard container.

## Privacy & Safety

- All form inputs are optional except relationship type.
- Never log user inputs to console.
- Shared poems use base64 encoding (not localStorage for final poem).
- Add rel="nofollow" to share links.
- Include Content-Security-Policy header in next.config.js.

## Performance Rules

- Use next/font for Google Fonts (no external CSS fetches).
- Framer Motion: Use layoutId only when necessary, prefer AnimatePresence mode="wait".
- API route must implement rate limiting (5 req/min per IP).

## File Structure
