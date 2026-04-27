import useSWR from 'swr'
import type { Card } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useCards() {
  const { data, error, isLoading, mutate } = useSWR<Card[]>('/api/cards', fetcher)

  async function createCard(stageId: string, title: string) {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage_id: stageId, title }),
    })
    const card = await res.json()
    await mutate()
    return card as Card
  }

  async function updateCard(
    id: string,
    patch: Partial<Pick<Card, 'title' | 'description' | 'script' | 'stage_id' | 'position'>> & {
      platform_ids?: string[]
    }
  ) {
    const prev = data
    // Optimistic update
    mutate(
      data?.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      false
    )
    try {
      await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      mutate()
    } catch {
      mutate(prev, false)
    }
  }

  async function deleteCard(id: string) {
    mutate(data?.filter((c) => c.id !== id), false)
    await fetch(`/api/cards/${id}`, { method: 'DELETE' })
    mutate()
  }

  function getCardsByStage(stageId: string): Card[] {
    return (data ?? [])
      .filter((c) => c.stage_id === stageId)
      .sort((a, b) => a.position - b.position)
  }

  return {
    cards: data ?? [],
    isLoading,
    error,
    mutate,
    createCard,
    updateCard,
    deleteCard,
    getCardsByStage,
  }
}

export function useCard(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Card>(
    id ? `/api/cards/${id}` : null,
    fetcher
  )

  return { card: data, isLoading, error, mutate }
}
