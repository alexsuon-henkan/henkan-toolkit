import { NextResponse, type NextRequest } from "next/server"
import { Anthropic } from "@anthropic-ai/sdk"
import { Buffer } from "node:buffer"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const systemPrompt = `
You are an expert front-end developer who produces JavaScript for informational banners
and interactive modals (countdowns, newsletter pop-ups, etc.).

Return ONLY a JSON object with exactly these keys:
  "javascript" – a single-line JSON string containing raw JavaScript (no backticks).
  "explanation" – short human explanation (2-4 sentences).

The code must be ready to paste into the browser console and should add/removes DOM nodes cleanly.
Do NOT wrap any value in markdown fences.
Add at the very top of the JS a comment:
// DEVELOPER REVIEW RECOMMENDED: AI-generated starter.
`

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const prompt = form.get("prompt") as string | null
    const imageFile = form.get("image") as File | null

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    const userContent: any[] = [{ type: "text", text: prompt }]

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      userContent.unshift({
        type: "image",
        source: {
          type: "base64",
          media_type: imageFile.type,
          data: base64,
        },
      })
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
    })

    let content = (response.content[0] as any)?.text?.trim() || ""

    // Remove ```json or ``` fences if present
    if (content.startsWith("```")) {
      content = content
        .replace(/^```[\w]*\n?/, "")
        .replace(/```$/, "")
        .trim()
    }

    // Attempt to parse; if it fails, try to recover common backtick-wrapped code
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      // Replace backtick-wrapped JS value
      content = content.replace(
        /"javascript"\s*:\s*`([\s\S]*?)`/,
        (_match, p1) => `"javascript":"${p1.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`,
      )
      parsed = JSON.parse(content)
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: (err as Error).message || "Internal server error" }, { status: 500 })
  }
}
