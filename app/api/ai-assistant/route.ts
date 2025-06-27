import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set in the environment variables")
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const systemPrompt = `You are an expert front-end developer specializing in creating JavaScript code for website banners and modals. Your primary task is to generate a single JSON object containing two keys: "explanation" and "javascript".

- "explanation": A brief, clear explanation of what the JavaScript code does and how to use it.
- "javascript": The raw JavaScript code. This code should be immediately executable in a browser's developer console. It must not be wrapped in markdown backticks or any other formatting.

The generated JavaScript should:
1.  Be self-contained and not require external libraries.
2.  Manipulate the DOM to create, style, and inject the requested banner or modal.
3.  Include basic styling within the script (e.g., setting element.style properties) to ensure the component is visually acceptable.
4.  Be robust and include checks for existing elements where appropriate.
5.  The generated code is a starting point. Add a comment at the top of the generated JavaScript: "// DEVELOPER REVIEW RECOMMENDED: This is an AI-generated starting point."

Analyze the user's prompt and the provided screenshot to inform the styling and placement of the generated component. The final output must be only the JSON object.
`

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const userPrompt = formData.get("prompt") as string
    const imageFile = formData.get("image") as File

    if (!userPrompt || !imageFile) {
      return NextResponse.json({ error: "Prompt and image are required." }, { status: 400 })
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const base64 = buffer.toString("base64")
    const mimeType = imageFile.type

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64,
              },
            },
            {
              type: "text",
              text: userPrompt,
            },
          ],
        },
      ],
    })

    // @ts-ignore - SDK types might not be fully updated for content blocks
    const content = response.content[0]?.text
    if (!content) {
      throw new Error("Failed to get a valid response from AI.")
    }

    // The response from Claude should be the JSON string directly
    const parsedResponse = JSON.parse(content)
    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("AI Assistant API error:", error)
    let errorMessage = "An unknown error occurred."
    if (error instanceof Anthropic.APIError) {
      errorMessage = `Anthropic API Error: ${error.status} ${error.name} - ${error.message}`
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
