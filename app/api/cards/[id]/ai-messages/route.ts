import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { messages } = await request.json()

  // Verify ownership
  const { data: card } = await supabase
    .from('cards')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Replace all messages for this card
  await supabase.from('ai_messages').delete().eq('card_id', id)

  if (messages.length > 0) {
    await supabase.from('ai_messages').insert(
      messages.map((m: { role: string; content: string }) => ({
        card_id: id,
        role: m.role,
        content: m.content,
      }))
    )
  }

  return NextResponse.json({ success: true })
}
