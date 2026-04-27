'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import { AddCardButton } from './AddCardButton'
import type { Card, Stage } from '@/lib/types'
import { STAGE_COLORS, STAGE_TEXT_COLORS } from '@/lib/types'

interface KanbanColumnProps {
  stage: Stage
  cards: Card[]
  onCardClick: (card: Card) => void
  onAddCard: (stageId: string, title: string) => Promise<void>
}

export function KanbanColumn({ stage, cards, onCardClick, onAddCard }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage-${stage.id}`,
    data: { type: 'stage', stageId: stage.id },
  })

  const bgColor = stage.color ?? STAGE_COLORS[stage.name] ?? '#F8F9FA'
  const textColor = STAGE_TEXT_COLORS[stage.name] ?? '#374151'

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {stage.name}
          </span>
          <span className="text-xs text-gray-300 font-medium">{cards.length}</span>
        </div>
      </div>

      {/* Cards list */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 rounded-xl p-2 space-y-2 min-h-[120px] transition-colors
          ${isOver ? 'bg-gray-50 ring-1 ring-gray-200' : 'bg-transparent'}
        `}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && !isOver && (
          <div className="flex items-center justify-center h-20 border border-dashed border-gray-200 rounded-xl">
            <span className="text-xs text-gray-300">No cards yet</span>
          </div>
        )}
      </div>

      {/* Add card */}
      <div className="mt-2 px-1">
        <AddCardButton onAdd={(title) => onAddCard(stage.id, title)} />
      </div>
    </div>
  )
}
