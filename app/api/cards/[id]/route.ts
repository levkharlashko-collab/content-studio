import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      platforms:card_platforms(
        platform:platforms(*)
      ),
      ai_messages(*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  return NextResponse.json({
    ...data,
    platforms: data.platforms?.map((cp: { platform: unknown }) => cp.platform) ?? [],
    ai_messages: data.ai_messages ?? [],
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { platform_ids, ...cardPatch } = await request.json()

  // Update card fields
  if (Object.keys(cardPatch).length > 0) {
    const { error } = await supabase
      .from('cards')
      .update(cardPatch)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update platforms if provided
  if (platform_ids !== undefined) {
    await supabase.from('card_platforms').delete().eq('card_id', id)

    if (platform_ids.length > 0) {
      await supabase.from('card_platforms').insert(
        platform_ids.map((pid: string) => ({ card_id: id, platform_id: pid }))
      )
    }
  }

  // Return updated card
  const { data, error } = await supabase
    .from('cards')
    .select(`
      *,
      platforms:card_platforms(
        platform:platforms(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    ...data,
    platforms: data.platforms?.map((cp: { platform: unknown }) => cp.platform) ?? [],
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
