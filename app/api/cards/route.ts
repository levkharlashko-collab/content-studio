import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      platforms:card_platforms(
        platform:platforms(*)
      )
    `)
    .eq('user_id', user.id)
    .order('position')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Flatten nested platform join
  const cards = data.map((card) => ({
    ...card,
    platforms: card.platforms?.map((cp: { platform: unknown }) => cp.platform) ?? [],
  }))

  return NextResponse.json(cards)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { stage_id, title } = await request.json()

  // Get max position in this stage
  const { data: existing } = await supabase
    .from('cards')
    .select('position')
    .eq('user_id', user.id)
    .eq('stage_id', stage_id)
    .order('position', { ascending: false })
    .limit(1)

  const maxPosition = existing?.[0]?.position ?? 0
  const position = maxPosition + 1000

  const { data, error } = await supabase
    .from('cards')
    .insert({ user_id: user.id, stage_id, title, position })
    .select(`
      *,
      platforms:card_platforms(
        platform:platforms(*)
      )
    `)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    ...data,
    platforms: data.platforms?.map((cp: { platform: unknown }) => cp.platform) ?? [],
  })
}
