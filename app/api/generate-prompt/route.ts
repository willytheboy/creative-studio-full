import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const prompt = `Create a high-quality promotional image for ${body.goal}. Audience: ${body.audience}. Style: ${body.style}. Protect a flexible bottom-right watermark zone, leave clean text space for captions and CTA, and preserve the main subject. Additional notes: ${body.notes}`
  return NextResponse.json({ prompt })
}
