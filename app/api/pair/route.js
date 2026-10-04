import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request) {
  let body

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Please enter a valid WhatsApp number." }, { status: 400 })
  }

  const number = typeof body?.number === "string" ? body.number.replace(/\D/g, "") : ""

  if (!/^\d{7,15}$/.test(number)) {
    return NextResponse.json({ error: "Enter a valid number with its country code." }, { status: 400 })
  }

  try {
    const response = await fetch(`https://knight-bot-paircode.onrender.com/code?number=${encodeURIComponent(number)}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "The pairing service is unavailable. Please try again shortly." }, { status: 503 })
    }

    const result = await response.json()
    const code = typeof result?.code === "string" ? result.code.trim() : ""

    if (!code || code === "Service Unavailable") {
      return NextResponse.json({ error: "We couldn’t generate a pairing code. Please try again shortly." }, { status: 503 })
    }

    return NextResponse.json({ code })
  } catch {
    return NextResponse.json({ error: "The pairing service could not be reached. Please try again shortly." }, { status: 503 })
  }
}
