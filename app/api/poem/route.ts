import { NextRequest, NextResponse } from 'next/server'
import { groq } from '@/lib/groq-client'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import type { RequestBody } from '@/lib/valentino'

export const runtime = 'edge'

function extractJson(text: string): { title: string; poem: string } | null {
  let jsonStr = text.trim()
  
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  }
  
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    jsonStr = objectMatch[0]
  }
  
  try {
    const parsed = JSON.parse(jsonStr)
    if (typeof parsed.title === 'string' && typeof parsed.poem === 'string') {
      return parsed
    }
  } catch {
    return null
  }
  
  return null
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rateLimitResult = checkRateLimit(ip)
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.', reset: rateLimitResult.reset },
      { status: 429 }
    )
  }

  try {
    const body = (await req.json()) as RequestBody

    const nickname = (body.nickname ?? '').trim().slice(0, 40)
    const relationship = (body.relationship ?? '').trim().slice(0, 30)
    const traits = Array.isArray(body.traits) ? body.traits.slice(0, 3).map(String) : []
    const vibe = (body.vibe ?? '').trim().slice(0, 30)

    const memory = `Relationship: ${relationship || 'unknown'}. Traits: ${traits.join(', ') || 'none'}.`
    const safeNickname = nickname.length > 0 ? nickname : 'someone'

    const system = `You are a romantic poet. Write a 8-12 line poem for Valentine's Day.

Rules:
- Never include real names, only use the nickname provided
- Tone matches the selected vibe
- Include specific references to the traits provided
- No clichés about roses unless relevant
- Be creative and heartfelt

Output ONLY valid JSON with no markdown formatting:
{"title": "Your Title Here", "poem": "Line 1\\nLine 2\\nLine 3\\n..."}`

    const prompt = [
      `Nickname: ${safeNickname}`,
      `Vibe: ${vibe}`,
      `Traits: ${traits.join(', ')}`,
      `Memory: ${memory}`,
      '',
      'Write the poem now. Return ONLY valid JSON, no markdown, no code blocks.'
    ].join('\n')

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.9,
      stream: false,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt }
      ]
    })

    const content = completion.choices[0]?.message?.content || ''
    
    const result = extractJson(content)
    
    if (!result) {
      console.error('Failed to parse LLM response:', content.slice(0, 500))
      
      const titleMatch = content.match(/"title"\s*:\s*"([^"]+)"/)
      const poemMatch = content.match(/"poem"\s*:\s*"([^"]+)"/s)
      
      if (titleMatch && poemMatch) {
        return NextResponse.json({
          title: titleMatch[1],
          poem: poemMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
        })
      }
      
      const fallbackPoem = generateFallbackPoem(safeNickname, relationship, traits, vibe)
      return NextResponse.json(fallbackPoem)
    }

    result.poem = result.poem.replace(/\\n/g, '\n').replace(/\\"/g, '"')

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store',
        'X-RateLimit-Limit': '20',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString()
      }
    })

  } catch (error) {
    console.error('Poem generation error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('GROQ_API_KEY')) {
        return NextResponse.json(
          { error: 'Service configuration error. Please contact support.' },
          { status: 500 }
        )
      }
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in a moment.' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate poem. Please try again.' },
      { status: 500 }
    )
  }
}

function generateFallbackPoem(
  nickname: string,
  relationship: string,
  traits: string[],
  vibe: string
): { title: string; poem: string } {
  const trait = traits[0] || 'special'
  
  const poems: Record<string, { title: string; poem: string }> = {
    Sweet: {
      title: `For ${nickname}`,
      poem: `In every moment, big or small,\nYou're the ${trait}est of them all.\nA heart so warm, a soul so true,\nSo much love I have for you.\n\nLike morning light on quiet days,\nYou brighten up my darkest haze.\nForever grateful, forever near,\nMy heart belongs to you, my dear.`
    },
    Funny: {
      title: `Ode to ${nickname}`,
      poem: `You're ${trait}, that's no lie,\nBut you're also kind of a goofball, I won't deny.\nFrom dad jokes to puns so bad,\nYou're the best fun I've ever had.\n\nSo here's to us, a perfect pair,\nTwo weirdos with love to spare.\nI'd choose you every single day,\nIn your own ${trait} way.`
    },
    Deep: {
      title: `To ${nickname}`,
      poem: `There are words that never leave the tongue,\nAnd feelings that can't be undone.\nIn you I've found a kindred soul,\nA love that makes me completely whole.\n\nYou're ${trait} in ways untold,\nWorth more than silver, more than gold.\nThis quiet truth I hold so dear,\nHoping you might one day hear.`
    },
    Confession: {
      title: `A Secret for ${nickname}`,
      poem: `I've kept this hidden in my heart,\nNot knowing really where to start.\nYou're ${trait}, you're kind, you're true,\nAnd I can't stop thinking of you.\n\nThis Valentine's, I'll take the chance,\nTo show you this shy romance.\nWhatever comes, I want you to know,\nYou're the reason my heart can grow.`
    }
  }
  
  return poems[vibe] || poems.Sweet
}
