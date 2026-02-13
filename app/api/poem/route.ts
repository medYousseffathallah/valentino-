import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const demoPoems: Record<string, { title: string; poem: string }> = {
  Sweet: {
    title: "For You",
    poem: `In every moment, big or small,
You're the sweetest of them all.
A heart so warm, a soul so true,
So much love I have for you.

Like morning light on quiet days,
You brighten up my darkest haze.
Forever grateful, forever near,
My heart belongs to you, my dear.`
  },
  Funny: {
    title: "Ode to You",
    poem: `You're amazing, that's no lie,
But you're also kind of a goofball, I won't deny.
From dad jokes to puns so bad,
You're the best fun I've ever had.

So here's to us, a perfect pair,
Two weirdos with love to spare.
I'd choose you every single day,
In your own special way.`
  },
  Deep: {
    title: "To You",
    poem: `There are words that never leave the tongue,
And feelings that can't be undone.
In you I've found a kindred soul,
A love that makes me completely whole.

You're beautiful in ways untold,
Worth more than silver, more than gold.
This quiet truth I hold so dear,
Hoping you might one day hear.`
  },
  Confession: {
    title: "A Secret for You",
    poem: `I've kept this hidden in my heart,
Not knowing really where to start.
You're wonderful, you're kind, you're true,
And I can't stop thinking of you.

This Valentine's, I'll take the chance,
To show you this shy romance.
Whatever comes, I want you to know,
You're the reason my heart can grow.`
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nickname = 'someone', vibe = 'Sweet' } = body
    
    const poem = demoPoems[vibe] || demoPoems.Sweet
    const personalizedPoem = {
      title: poem.title.replace('You', nickname),
      poem: poem.poem.replace(/you/gi, nickname.toLowerCase()).replace(/You/g, nickname)
    }
    
    return NextResponse.json(personalizedPoem, {
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('Demo poem error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate poem. Please try again.' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}