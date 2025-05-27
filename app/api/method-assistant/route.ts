import { type NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are an expert in experimentation strategy, user research, and digital testing methods.

The user will describe a product idea, feature, redesign, or optimization project. Your job is to provide a **strategic recommendation** on whether and how they should test it, based on the 40 known quantitative and qualitative testing methods.

Return the following:

1. ✅ Say whether testing is needed (yes/no).
2. 🧪 Say whether the project needs **quantitative**, **qualitative**, or **both** types of research.
3. 🏆 Return a **Top 5 Ranked Methods**:
   - Rank them from most to least useful.
   - For each, include the method name, its type (quant / quali / hybrid), and why it's appropriate.
4. ⏱ **Timeline recommendation**: Suggest a 2 to 4-step testing sequence using the selected methods:
   - What to do **before launch** (research, quick validation),
   - What to do **at launch** (experiments, rollout),
   - What to monitor **after launch** (replays, holdouts, long-term impact).
5. 🛠 Mention any **practical requirements** (traffic volume, user type, time constraints, design/development dependencies).
6. 💬 Use a clear, friendly and helpful tone, like an experienced product advisor.

Available testing methods (40 total):
**Quantitative/Data-driven:**
A/B Test, A/A Test, A/B/C/N Test, Multivariate Test (MVT), Multi-Armed Bandit (MAB), Personalisation Test, Quasi-expérimentation, Interrupted Time Series (ITS), Propensity Score Matching, Regression Discontinuity Design (RDD), Feature Flag A/B Test, Progressive Rollout, Cookie-based Holdout, Geo Holdout Test, Cross-device test, Shadow Testing, Ghost Experiment, Backtesting, Fake Door Test, Smoke Test, Longitudinal Test, Holdback Permanent

**Qualitative/User Testing:**
User Test Modéré, User Test Non Modéré, Think Aloud Protocol, 5-Second Test, First Click Test, Task Completion Test, Eye Tracking, Heatmaps & Clickmaps, Session Replay, Funnel Analysis, In-product Survey, NPS / CSAT / CES, Bug Report intégré, Diary Study, Click Test / Preference Test, Card Sorting, Tree Testing, Customer Interview

Assume the user understands A/B testing and user testing, but does not know all 40 methods. Avoid jargon.

Your response must be a JSON object with this exact structure:
{
  "testingNeeded": true/false,
  "researchType": "quantitative/qualitative/both",
  "topMethods": [
    {
      "rank": 1,
      "method": "exact method name",
      "type": "quant/quali/hybrid",
      "reasoning": "why it's appropriate for this project"
    }
    // ... up to 5 methods
  ],
  "timeline": {
    "beforeLaunch": ["step 1", "step 2"],
    "atLaunch": ["step 1", "step 2"], 
    "afterLaunch": ["step 1", "step 2"]
  },
  "requirements": ["practical requirement 1", "practical requirement 2"],
  "summary": "2-3 sentence strategic overview of the recommended approach"
}`

export async function POST(request: NextRequest) {
  try {
    const { projectDescription } = await request.json()

    if (!projectDescription) {
      return NextResponse.json({ error: "Project description is required" }, { status: 400 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: projectDescription },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const recommendation = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({ recommendation })
  } catch (error) {
    console.error("Error in method assistant:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
