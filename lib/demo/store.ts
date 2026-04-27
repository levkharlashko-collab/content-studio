'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Card, Stage } from '@/lib/types'
import { DEMO_CARDS, DEMO_STAGES, DEMO_PLATFORMS } from './data'

const STORAGE_KEY = 'content-studio-demo'

function loadFromStorage() {
  if (typeof window === 'undefined') return { cards: DEMO_CARDS, stages: DEMO_STAGES }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { cards: DEMO_CARDS, stages: DEMO_STAGES }
}

function saveToStorage(data: { cards: Card[]; stages: Stage[] }) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useDemoStore() {
  const [cards, setCards] = useState<Card[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const data = loadFromStorage()
    setCards(data.cards)
    setStages(data.stages)
    setLoaded(true)
  }, [])

  const persist = useCallback((newCards: Card[], newStages: Stage[]) => {
    saveToStorage({ cards: newCards, stages: newStages })
  }, [])

  const createCard = useCallback((stageId: string, title: string): Card => {
    const colCards = cards.filter((c) => c.stage_id === stageId)
    const maxPos = colCards.length > 0 ? Math.max(...colCards.map((c) => c.position)) : 0
    const newCard: Card = {
      id: `c${Date.now()}`,
      user_id: 'demo',
      stage_id: stageId,
      title,
      description: null,
      script: null,
      position: maxPos + 1000,
      platforms: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const next = [...cards, newCard]
    setCards(next)
    persist(next, stages)
    return newCard
  }, [cards, stages, persist])

  const updateCard = useCallback((id: string, patch: Partial<Card> & { platform_ids?: string[] }) => {
    const { platform_ids, ...cardPatch } = patch
    const next = cards.map((c) => {
      if (c.id !== id) return c
      const updated = { ...c, ...cardPatch, updated_at: new Date().toISOString() }
      if (platform_ids !== undefined) {
        updated.platforms = DEMO_PLATFORMS.filter((p) => platform_ids.includes(p.id))
      }
      return updated
    })
    setCards(next)
    persist(next, stages)
  }, [cards, stages, persist])

  const deleteCard = useCallback((id: string) => {
    const next = cards.filter((c) => c.id !== id)
    setCards(next)
    persist(next, stages)
  }, [cards, stages, persist])

  const createStage = useCallback((name: string): Stage => {
    const maxPos = stages.length > 0 ? Math.max(...stages.map((s) => s.position)) : -1
    const newStage: Stage = {
      id: `s${Date.now()}`,
      user_id: 'demo',
      name,
      position: maxPos + 1,
      color: null,
      created_at: new Date().toISOString(),
    }
    const next = [...stages, newStage]
    setStages(next)
    persist(cards, next)
    return newStage
  }, [cards, stages, persist])

  const updateStage = useCallback((id: string, patch: Partial<Stage>) => {
    const next = stages.map((s) => (s.id === id ? { ...s, ...patch } : s))
    setStages(next)
    persist(cards, next)
  }, [cards, stages, persist])

  const deleteStage = useCallback((id: string) => {
    const next = stages.filter((s) => s.id !== id)
    setStages(next)
    persist(cards, next)
  }, [cards, stages, persist])

  const getCardsByStage = useCallback((stageId: string) =>
    cards.filter((c) => c.stage_id === stageId).sort((a, b) => a.position - b.position),
    [cards]
  )

  return {
    cards, stages, loaded,
    createCard, updateCard, deleteCard,
    createStage, updateStage, deleteStage,
    getCardsByStage,
    platforms: DEMO_PLATFORMS,
  }
}
