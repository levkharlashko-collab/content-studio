'use client'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScriptEditor } from './ScriptEditor'
import { AiSidebar } from './AiSidebar'
import { useCard, useCards } from '@/lib/hooks/useCards'
import { usePlatforms } from '@/lib/hooks/usePlatforms'
import { useStages } from '@/lib/hooks/useStages'
import { PLATFORM_COLORS } from '@/lib/types'
import { Trash2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface CardModalProps {
  cardId: string | null
  open: boolean
  onClose: () => void
}

export function CardModal({ cardId, open, onClose }: CardModalProps) {
  const { card, mutate: mutateCard } = useCard(cardId ?? '')
  const { updateCard, deleteCard } = useCards()
  const { platforms } = usePlatforms()
  const { stages } = useStages()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [script, setScript] = useState('')
  const [stageId, setStageId] = useState('')
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([])
  const [showAi, setShowAi] = useState(false)

  // Sync local state when card loads
  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDescription(card.description ?? '')
      setScript(card.script ?? '')
      setStageId(card.stage_id)
      setSelectedPlatformIds(card.platforms.map((p) => p.id))
    }
  }, [card])

  const saveField = useCallback(
    async (patch: Parameters<typeof updateCard>[1]) => {
      if (!cardId) return
      await updateCard(cardId, patch)
      mutateCard()
    },
    [cardId, updateCard, mutateCard]
  )

  async function handleTitleBlur() {
    if (!card || title === card.title) return
    await saveField({ title })
  }

  async function handleDescriptionBlur() {
    if (!card || description === card.description) return
    await saveField({ description })
  }

  async function handleScriptSave(value: string) {
    await saveField({ script: value })
  }

  async function handleStageChange(newStageId: string) {
    setStageId(newStageId)
    await saveField({ stage_id: newStageId })
  }

  async function togglePlatform(platformId: string) {
    const next = selectedPlatformIds.includes(platformId)
      ? selectedPlatformIds.filter((id) => id !== platformId)
      : [...selectedPlatformIds, platformId]
    setSelectedPlatformIds(next)
    await saveField({ platform_ids: next })
  }

  async function handleDelete() {
    if (!cardId) return
    if (!confirm('Delete this card? This cannot be undone.')) return
    await deleteCard(cardId)
    toast.success('Card deleted')
    onClose()
  }

  function handleInsertIntoScript(text: string) {
    const separator = script.trim() ? '\n\n' : ''
    const newScript = script + separator + text
    setScript(newScript)
    saveField({ script: newScript })
  }

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={`
        p-0 overflow-hidden
        ${showAi
          ? 'w-[min(90vw,1100px)] max-w-[1100px]'
          : 'w-[min(90vw,680px)] max-w-[680px]'
        }
        max-h-[90vh] flex flex-col
      `}>
        <div className="flex flex-1 min-h-0">
          {/* Left panel — card content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Card header */}
            <div className="px-6 pt-6 pb-4 space-y-4">
              {/* Title */}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Card title"
                className="w-full text-xl font-semibold text-gray-900 outline-none placeholder:text-gray-300 bg-transparent"
              />

              {/* Meta row: stage + platforms */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 shrink-0">Stage</span>
                  <Select value={stageId} onValueChange={handleStageChange}>
                    <SelectTrigger className="h-7 text-xs w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 shrink-0">Platform</span>
                  <div className="flex gap-1.5">
                    {platforms.map((p) => {
                      const selected = selectedPlatformIds.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className="transition-all"
                        >
                          <Badge
                            color={selected ? PLATFORM_COLORS[p.name] : undefined}
                            className={
                              selected
                                ? 'ring-1'
                                : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                            }
                            style={selected ? { ringColor: PLATFORM_COLORS[p.name] } : undefined}
                          >
                            {p.icon} {p.name}
                          </Badge>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="px-6 py-4">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                placeholder="Add notes, research, ideas…"
                rows={3}
                className="w-full text-sm text-gray-700 leading-relaxed resize-none outline-none placeholder:text-gray-300 bg-transparent"
              />
            </div>

            <Separator />

            {/* Script */}
            <div className="px-6 py-4 flex-1">
              <ScriptEditor
                value={script}
                onChange={setScript}
                onSave={handleScriptSave}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete card
              </button>

              <button
                onClick={() => setShowAi((v) => !v)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                  ${showAi
                    ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {showAi ? 'Hide AI' : 'Polish with AI'}
              </button>
            </div>
          </div>

          {/* Right panel — AI sidebar */}
          {showAi && (
            <div className="w-80 shrink-0 flex flex-col min-h-0">
              <AiSidebar
                cardId={card.id}
                cardTitle={card.title}
                cardScript={script}
                initialMessages={(card as unknown as { ai_messages?: import('@/lib/types').AiMessage[] }).ai_messages}
                onInsertIntoScript={handleInsertIntoScript}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
