'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import type { Card } from '@/lib/types'
import { PLATFORM_COLORS } from '@/lib/types'
import { formatDistanceToNow } from '@/lib/utils/date'

interface KanbanCardProps {
  card: Card
  onClick: () => void
  isDragOverlay?: boolean
}

export function KanbanCard({ card, onClick, isDragOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', card, stageId: card.stage_id },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        group relative bg-white border border-gray-100 rounded-xl p-3.5 cursor-pointer
        hover:border-gray-200 hover:shadow-sm transition-all
        ${isDragging ? 'opacity-40' : ''}
        ${isDragOverlay ? 'shadow-lg rotate-1 scale-[1.02] cursor-grabbing' : ''}
      `}
    >
      {/* Drag handle — invisible touch target */}
      <div
        {...listeners}
        className="absolute inset-0 rounded-xl cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Card content — above drag handle */}
      <div className="relative pointer-events-none">
        <p className="text-sm font-medium text-gray-900 leading-snug">{card.title}</p>

        {card.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {card.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-1">
            {card.platforms.map((p) => (
              <Badge key={p.id} color={PLATFORM_COLORS[p.name]}>
                {p.icon} {p.name}
              </Badge>
            ))}
          </div>
          <span className="text-[10px] text-gray-300 shrink-0 ml-2">
            {formatDistanceToNow(card.created_at)}
          </span>
        </div>
      </div>

      {/* Click target — above drag handle but allows clicks through */}
      <div
        className="absolute inset-0 rounded-xl"
        onClick={(e) => { e.stopPropagation(); onClick() }}
      />
    </div>
  )
}
