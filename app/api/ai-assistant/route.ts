import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const systemPrompt = `You are an expert front-end developer specializing in creating JavaScript code for website banners and modals. Your primary task is to generate a single JSON object containing two keys: "explanation" and "javascript".

- "explanation": A brief, clear explanation of what the JavaScript code does and how to use it.
- "javascript": The raw JavaScript code. This code should be immediately executable in a browser's developer console. It must not be wrapped in markdown backticks.

The generated JavaScript should:
1.  Be self-contained and not require external libraries unless absolutely necessary (and if so, mention it in the explanation).
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2000,
      response_format: { type: "json_object" },
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
              text: userPrompt,
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
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("Failed to get a valid response from AI.")
    }

    const parsedResponse = JSON.parse(content)
    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("AI Assistant API error:", error)
    let errorMessage = "An unknown error occurred."
    if (error instanceof OpenAI.APIError) {
      errorMessage = `OpenAI API Error: ${error.status} ${error.name} - ${error.message}`
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
