import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ ok: true, message: 'Connect this endpoint to OpenAI image generation/editing.', received: body })
}
