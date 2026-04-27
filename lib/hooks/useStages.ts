import useSWR from 'swr'
import type { Stage } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useStages() {
  const { data, error, isLoading, mutate } = useSWR<Stage[]>('/api/stages', fetcher)

  async function createStage(name: string) {
    const res = await fetch('/api/stages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const stage = await res.json()
    mutate()
    return stage
  }

  async function updateStage(id: string, patch: Partial<Pick<Stage, 'name' | 'position' | 'color'>>) {
    await fetch(`/api/stages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    mutate()
  }

  async function deleteStage(id: string) {
    await fetch(`/api/stages/${id}`, { method: 'DELETE' })
    mutate()
  }

  return {
    stages: data ?? [],
    isLoading,
    error,
    mutate,
    createStage,
    updateStage,
    deleteStage,
  }
}
