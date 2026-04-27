import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, cardScript, cardTitle } = await request.json()

  const scriptContext = cardScript?.trim()
    ? `The user is working on the following script:\n---\n${cardScript}\n---\n\n`
    : ''

  const titleContext = cardTitle ? `Content title: "${cardTitle}"\n` : ''

  const systemPrompt = `You are a content script assistant helping a creator polish and improve their scripts for social media (Instagram, YouTube, TikTok).

${titleContext}${scriptContext}Your job is to help the user improve their script based on their instructions. You can:
- Rewrite sections to be more engaging
- Strengthen hooks and CTAs
- Adjust tone, pacing, or structure
- Expand or condense specific parts
- Suggest better transitions or B-roll notes

When the user asks you to improve or rewrite something, return ONLY the improved content — no preamble like "Here's the rewritten version:" or explanations of what you changed. Just the improved text, ready to use.

When the user asks a question or wants feedback, you can explain your suggestions briefly.`

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
