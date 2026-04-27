'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import type { Card, Stage } from '@/lib/types'
import { useCards } from '@/lib/hooks/useCards'
import { useStages } from '@/lib/hooks/useStages'
import { toast } from 'sonner'

interface KanbanBoardProps {
  onCardClick: (card: Card) => void
}

export function KanbanBoard({ onCardClick }: KanbanBoardProps) {
  const { cards, createCard, updateCard, getCardsByStage, mutate } = useCards()
  const { stages, isLoading } = useStages()
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    if (active.data.current?.type === 'card') {
      setActiveCard(active.data.current.card)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeCardData = active.data.current?.card as Card
    if (!activeCardData) return

    const overId = String(over.id)

    // Determine target stage
    let targetStageId: string
    let targetPosition: number

    if (overId.startsWith('stage-')) {
      // Dropped onto a column
      targetStageId = overId.replace('stage-', '')
      const colCards = getCardsByStage(targetStageId)
      targetPosition = colCards.length > 0
        ? (colCards[colCards.length - 1].position + 1000)
        : 1000
    } else {
      // Dropped onto another card
      const overCard = cards.find((c) => c.id === overId)
      if (!overCard) return
      targetStageId = overCard.stage_id

      const colCards = getCardsByStage(targetStageId)
      const overIndex = colCards.findIndex((c) => c.id === overId)
      const activeIndex = colCards.findIndex((c) => c.id === activeCardData.id)

      if (activeCardData.stage_id === targetStageId) {
        // Same column reorder
        const reordered = arrayMove(colCards, activeIndex, overIndex)
        const updates = reordered.map((c, i) => ({ ...c, position: (i + 1) * 1000 }))

        // Optimistic update
        mutate(
          cards.map((c) => {
            const u = updates.find((u) => u.id === c.id)
            return u ?? c
          }),
          false
        )

        // Persist all position changes
        await Promise.all(
          updates.map((c) =>
            updateCard(c.id, { position: c.position })
          )
        )
        return
      }

      // Cross-column: insert before overCard
      const prevCard = overIndex > 0 ? colCards[overIndex - 1] : null
      targetPosition = prevCard
        ? Math.floor((prevCard.position + overCard.position) / 2)
        : Math.floor(overCard.position / 2)
    }

    if (activeCardData.stage_id === targetStageId && overId.startsWith('stage-')) return

    try {
      await updateCard(activeCardData.id, {
        stage_id: targetStageId,
        position: targetPosition,
      })
    } catch {
      toast.error('Failed to move card')
    }
  }

  const handleAddCard = useCallback(
    async (stageId: string, title: string) => {
      try {
        await createCard(stageId, title)
      } catch {
        toast.error('Failed to create card')
      }
    },
    [createCard]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-72 h-48 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full items-start">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            cards={getCardsByStage(stage.id)}
            onCardClick={onCardClick}
            onAddCard={handleAddCard}
          />
        ))}

        {stages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">
              No stages yet — add one in Settings.
            </p>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeCard ? (
          <KanbanCard
            card={activeCard}
            onClick={() => {}}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
