import { groq } from '@/lib/groq-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test Groq API connection with a simple request
    const test = await groq.models.list()
    const hasModels = Array.isArray(test?.data) && test.data.length > 0
    
    return NextResponse.json({
      status: 'ok',
      groq: hasModels,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'error',
      groq: false,
      error: 'Failed to connect to Groq API',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
