import useSWR from 'swr'
import type { Platform } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function usePlatforms() {
  const { data, error, isLoading } = useSWR<Platform[]>('/api/platforms', fetcher)
  return { platforms: data ?? [], isLoading, error }
}
