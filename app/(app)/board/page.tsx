'use client'

import { useState, useEffect } from 'react'
import { KanbanBoard } from '@/components/board/KanbanBoard'
import { CardModal } from '@/components/card/CardModal'
import { TopBar } from '@/components/layout/TopBar'
import type { Card } from '@/lib/types'

export default function BoardPage() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  // Seed default stages on first visit
  useEffect(() => {
    fetch('/api/seed-stages', { method: 'POST' }).catch(() => {})
  }, [])

  return (
    <>
      <TopBar title="Board" />
      <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-5">
        <KanbanBoard
          onCardClick={(card: Card) => setSelectedCardId(card.id)}
        />
      </main>

      <CardModal
        cardId={selectedCardId}
        open={selectedCardId !== null}
        onClose={() => setSelectedCardId(null)}
      />
    </>
  )
}
