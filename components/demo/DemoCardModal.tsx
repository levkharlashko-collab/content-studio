'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScriptEditor } from '@/components/card/ScriptEditor'
import { PLATFORM_COLORS } from '@/lib/types'
import { Trash2, Sparkles } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { useDemoStore } from '@/lib/demo/store'

interface DemoCardModalProps {
  cardId: string
  store: ReturnType<typeof useDemoStore>
  onClose: () => void
}

export function DemoCardModal({ cardId, store, onClose }: DemoCardModalProps) {
  const card = store.cards.find((c) => c.id === cardId)
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [script, setScript] = useState(card?.script ?? '')
  const [stageId, setStageId] = useState(card?.stage_id ?? '')
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>(
    card?.platforms.map((p) => p.id) ?? []
  )
  const [showAi, setShowAi] = useState(false)

  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDescription(card.description ?? '')
      setScript(card.script ?? '')
      setStageId(card.stage_id)
      setSelectedPlatformIds(card.platforms.map((p) => p.id))
    }
  }, [cardId])

  if (!card) return null

  function save(patch: Parameters<typeof store.updateCard>[1]) {
    store.updateCard(cardId, patch)
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={`p-0 overflow-hidden ${showAi ? 'w-[min(90vw,1100px)] max-w-[1100px]' : 'w-[min(90vw,680px)] max-w-[680px]'} max-h-[90vh] flex flex-col`}>
        <div className="flex flex-1 min-h-0">
          {/* Left panel */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <div className="px-6 pt-6 pb-4 space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => save({ title })}
                placeholder="Card title"
                className="w-full text-xl font-semibold text-gray-900 outline-none placeholder:text-gray-300 bg-transparent"
              />

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 shrink-0">Stage</span>
                  <Select value={stageId} onValueChange={(v) => { setStageId(v); save({ stage_id: v }) }}>
                    <SelectTrigger className="h-7 text-xs w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {store.stages.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 shrink-0">Platform</span>
                  <div className="flex gap-1.5">
                    {store.platforms.map((p) => {
                      const selected = selectedPlatformIds.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            const next = selected
                              ? selectedPlatformIds.filter((id) => id !== p.id)
                              : [...selectedPlatformIds, p.id]
                            setSelectedPlatformIds(next)
                            save({ platform_ids: next })
                          }}
                        >
                          <Badge
                            color={selected ? PLATFORM_COLORS[p.name] : undefined}
                            className={selected ? 'ring-1' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}
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

            <div className="px-6 py-4">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => save({ description })}
                placeholder="Add notes, research, ideas…"
                rows={3}
                className="w-full text-sm text-gray-700 leading-relaxed resize-none outline-none placeholder:text-gray-300 bg-transparent"
              />
            </div>

            <Separator />

            <div className="px-6 py-4 flex-1">
              <ScriptEditor
                value={script}
                onChange={setScript}
                onSave={(v) => { save({ script: v }); return Promise.resolve() }}
              />
            </div>

            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  if (!confirm('Delete this card?')) return
                  store.deleteCard(cardId)
                  toast.success('Card deleted')
                  onClose()
                }}
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete card
              </button>

              <button
                onClick={() => setShowAi((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  showAi ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {showAi ? 'Hide AI' : 'Polish with AI'}
              </button>
            </div>
          </div>

          {/* AI panel — demo placeholder */}
          {showAi && (
            <div className="w-80 shrink-0 border-l border-gray-100 flex flex-col items-center justify-center px-6 text-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">AI Script Assistant</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  The AI assistant is available in the full version.<br />
                  Connect your Anthropic API key to activate it.
                </p>
              </div>
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-600 hover:underline"
              >
                Get a free API key →
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
