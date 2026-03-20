// Direct xAI REST API client — bypasses AI SDK provider versioning issues

const XAI_API_URL = "https://api.x.ai/v1/chat/completions"

interface GrokMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface GrokResponse {
  choices: { message: { content: string } }[]
}

export async function callGrok(messages: GrokMessage[]): Promise<string> {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) {
    throw new Error("XAI_API_KEY is not set")
  }

  const res = await fetch(XAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini-fast",
      messages,
      temperature: 0.4,
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Grok API error ${res.status}: ${text}`)
  }

  const data = (await res.json()) as GrokResponse
  return data.choices[0]?.message?.content ?? ""
}
