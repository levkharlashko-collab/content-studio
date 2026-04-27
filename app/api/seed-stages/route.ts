import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const DEFAULT_STAGES = [
  { name: 'Idea', position: 0, color: '#FEF9C3' },
  { name: 'Research', position: 1, color: '#DBEAFE' },
  { name: 'Scripting', position: 2, color: '#F3E8FF' },
  { name: 'Review', position: 3, color: '#FEE2E2' },
  { name: 'Published', position: 4, color: '#DCFCE7' },
]

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only seed if user has no stages yet
  const { count } = await supabase
    .from('stages')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count && count > 0) {
    return NextResponse.json({ seeded: false })
  }

  await supabase.from('stages').insert(
    DEFAULT_STAGES.map((s) => ({ ...s, user_id: user.id }))
  )

  return NextResponse.json({ seeded: true })
}
