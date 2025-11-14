import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const { GoogleGenerativeAI } = await import("@google/generative-ai")

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const systemInstruction = `You are IndustriSense AI, a factory maintenance assistant that helps with machine monitoring, maintenance planning, and troubleshooting.

CORE CAPABILITIES:
- Analyze machine health and readings
- Explain alerts and anomalies
- Recommend maintenance actions
- Help with troubleshooting
- Provide cost estimates
- Guide on using the system

RESPONSE RULES:
1. Keep responses concise and actionable
2. Use specific data when available (temperatures, dates, costs)
3. Provide clear next steps
4. Use bullet points for lists
5. NO markdown or HTML formatting - plain text only
6. Include machine IDs and specific metrics
7. End with actionable recommendations

QUERY CATEGORIES:
- Machine Health: Status, alerts, anomalies
- Maintenance: Schedules, overdue items, planning
- Troubleshooting: Temperature, vibration, pressure issues
- Reports: Costs, analytics, compliance
- Inventory: Parts stock, ordering
- Guidance: How-to questions, best practices

EXAMPLE RESPONSE FORMAT:
"CNC-001 triggered a critical alert due to anomaly:
- Temperature: 95°C (normal: 65-75°C)
- Vibration: 8.5 (normal: 2-5)

Recommended actions:
1. Stop machine immediately
2. Check cooling system
3. Schedule emergency maintenance

Estimated repair cost: ₹50,000-₹75,000 if addressed now."

Always be helpful, specific, and action-oriented.`

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: systemInstruction,
    })

    const history = messages.slice(0, -1)
      .filter((msg: any) => msg.role === "user" || msg.role === "assistant")
      .map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }))

    const chat = model.startChat({
      history: history.length > 0 && history[0].role === "model" ? history.slice(1) : history,
    })

    const result = await chat.sendMessageStream(messages[messages.length - 1].content)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error: any) {
    console.error("Chat API error:", error)
    
    // Handle quota exceeded
    if (error?.status === 429) {
      return new Response(
        "I'm currently experiencing high demand. Please try again in a few moments. In the meantime, you can:\n\n1. Check machine status in the Dashboard\n2. View maintenance schedules in Machines section\n3. Create work orders manually\n4. Review analytics for insights\n\nFor urgent issues, contact your supervisor directly.",
        {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache",
          },
        }
      )
    }
    
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}
