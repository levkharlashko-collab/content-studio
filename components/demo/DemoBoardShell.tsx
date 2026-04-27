'use client'

import { useState } from 'react'
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
import { KanbanColumn } from '@/components/board/KanbanColumn'
import { KanbanCard } from '@/components/board/KanbanCard'
import { DemoCardModal } from './DemoCardModal'
import { useDemoStore } from '@/lib/demo/store'
import type { Card } from '@/lib/types'
import { LayoutGrid, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Toaster, toast } from 'sonner'

export function DemoBoardShell() {
  const store = useDemoStore()
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const pathname = usePathname()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCard(null)
    if (!over) return

    const activeCardData = active.data.current?.card as Card
    if (!activeCardData) return

    const overId = String(over.id)

    if (overId.startsWith('stage-')) {
      const targetStageId = overId.replace('stage-', '')
      const colCards = store.getCardsByStage(targetStageId)
      const maxPos = colCards.length > 0 ? Math.max(...colCards.map((c) => c.position)) : 0
      store.updateCard(activeCardData.id, { stage_id: targetStageId, position: maxPos + 1000 })
    } else {
      const overCard = store.cards.find((c) => c.id === overId)
      if (!overCard) return
      const targetStageId = overCard.stage_id
      const colCards = store.getCardsByStage(targetStageId)
      const activeIndex = colCards.findIndex((c) => c.id === activeCardData.id)
      const overIndex = colCards.findIndex((c) => c.id === overId)

      if (activeCardData.stage_id === targetStageId) {
        const reordered = arrayMove(colCards, activeIndex, overIndex)
        reordered.forEach((c, i) => store.updateCard(c.id, { position: (i + 1) * 1000 }))
      } else {
        const prevCard = overIndex > 0 ? colCards[overIndex - 1] : null
        const newPos = prevCard
          ? Math.floor((prevCard.position + overCard.position) / 2)
          : Math.floor(overCard.position / 2)
        store.updateCard(activeCardData.id, { stage_id: targetStageId, position: newPos })
      }
    }
  }

  if (!store.loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-72 h-48 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-100 bg-white flex flex-col h-full">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white" />
                <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.3" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Content Studio</span>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {[
            { href: '/board', icon: LayoutGrid, label: 'Board' },
            { href: '/settings', icon: Settings, label: 'Settings' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === href || pathname.startsWith(href)
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">D</div>
            <span className="text-xs text-gray-500">Demo mode</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 shrink-0 border-b border-gray-100 bg-white flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-gray-900">Board</h1>
          <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full">
            Demo — data saved in browser only
          </span>
        </header>

        {/* Board */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e: DragStartEvent) => {
              if (e.active.data.current?.type === 'card') {
                setActiveCard(e.active.data.current.card)
              }
            }}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 h-full items-start">
              {store.stages.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  cards={store.getCardsByStage(stage.id)}
                  onCardClick={(card) => setSelectedCardId(card.id)}
                  onAddCard={async (stageId, title) => {
                    store.createCard(stageId, title)
                  }}
                />
              ))}
            </div>
            <DragOverlay>
              {activeCard ? (
                <KanbanCard card={activeCard} onClick={() => {}} isDragOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>

      {/* Card modal */}
      {selectedCardId && (
        <DemoCardModal
          cardId={selectedCardId}
          store={store}
          onClose={() => setSelectedCardId(null)}
        />
      )}

      <Toaster position="bottom-right" richColors />
    </div>
  )
}
