import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const systemPrompt = `You are an expert front-end developer specializing in creating JavaScript code for A/B testing. Your primary task is to generate JavaScript code for **informational banners** and **interactive modals** (like countdowns, newsletter signups, etc.).

You will be given a user prompt and a screenshot of a webpage.

**Instructions:**
1.  Analyze the user's request and the provided screenshot.
2.  Generate a single block of vanilla JavaScript code that can be run directly in a browser's developer console.
3.  The code should accomplish the user's goal (e.g., inject a banner, show a modal on exit-intent).
4.  The generated code should be considered a strong starting point (80-85% complete) but will require developer review. Add a comment at the top of the generated JavaScript code to this effect: \`// DEVELOPER REVIEW RECOMMENDED: This is an AI-generated starting point.\`
5.  Your entire response MUST be a single JSON object with two keys: "code" and "explanation".
    - "code": A string containing the complete JavaScript code.
    - "explanation": A string explaining what the code does and how to use it.

**Example JSON Output:**
{
  "code": "const banner = document.createElement('div'); banner.innerHTML = 'Special Offer!'; document.body.prepend(banner);",
  "explanation": "This script creates a simple banner and adds it to the top of the page."
}
`

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Server configuration error: Missing OpenAI API key." }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const prompt = formData.get("prompt") as string
    const imageFile = formData.get("image") as File | null

    if (!prompt || !imageFile) {
      return NextResponse.json({ error: "Prompt and image are required." }, { status: 400 })
    }

    const mimeType = imageFile.type
    const imageBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(imageBuffer).toString("base64")

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    })

    const responseText = response.choices[0]?.message?.content

    if (!responseText) {
      return NextResponse.json({ error: "Failed to get a valid response from AI." }, { status: 500 })
    }

    return new Response(responseText, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("AI Assistant API error:", error)
    let errorMessage = "An unknown error occurred."
    let statusCode = 500

    if (error instanceof OpenAI.APIError) {
      errorMessage = error.message
      statusCode = error.status || 500
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: statusCode })
  }
}
