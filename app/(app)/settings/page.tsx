'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useStages } from '@/lib/hooks/useStages'
import { Separator } from '@/components/ui/separator'
import { Plus, GripVertical, Pencil, Trash2, Check, X } from 'lucide-react'
import { STAGE_COLORS, STAGE_TEXT_COLORS } from '@/lib/types'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { stages, createStage, updateStage, deleteStage } = useStages()
  const [newStageName, setNewStageName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  async function handleAddStage(e: React.FormEvent) {
    e.preventDefault()
    if (!newStageName.trim()) return
    await createStage(newStageName.trim())
    setNewStageName('')
    toast.success('Stage added')
  }

  async function handleSaveEdit(id: string) {
    if (!editingName.trim()) return
    await updateStage(id, { name: editingName.trim() })
    setEditingId(null)
    toast.success('Stage renamed')
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete the "${name}" stage? Cards in this stage will not be deleted but will become stageless.`)) return
    await deleteStage(id)
    toast.success('Stage deleted')
  }

  return (
    <>
      <TopBar title="Settings" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-8 space-y-10">

          {/* Stages */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Stages</h2>
            <p className="text-xs text-gray-400 mb-4">
              Customize the columns on your board. Drag to reorder (coming soon).
            </p>

            <div className="space-y-1.5">
              {stages.map((stage) => {
                const bg = stage.color ?? STAGE_COLORS[stage.name] ?? '#F8F9FA'
                const text = STAGE_TEXT_COLORS[stage.name] ?? '#374151'

                return (
                  <div
                    key={stage.id}
                    className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-xl group"
                  >
                    <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />

                    {editingId === stage.id ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(stage.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        className="flex-1 text-sm outline-none border-b border-gray-300 pb-0.5"
                      />
                    ) : (
                      <span
                        className="flex-1 inline-flex items-center"
                      >
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: bg, color: text }}
                        >
                          {stage.name}
                        </span>
                      </span>
                    )}

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === stage.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(stage.id)}
                            className="p-1 text-green-500 hover:text-green-700 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(stage.id); setEditingName(stage.name) }}
                            className="p-1 text-gray-300 hover:text-gray-600 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(stage.id, stage.name)}
                            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <form onSubmit={handleAddStage} className="flex gap-2 mt-3">
              <input
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="New stage name…"
                className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
              />
              <button
                type="submit"
                disabled={!newStageName.trim()}
                className="flex items-center gap-1.5 px-3 h-9 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </form>
          </section>

          <Separator />

          {/* Platforms info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Platforms</h2>
            <p className="text-xs text-gray-400 mb-4">
              Available platform labels for tagging your content.
            </p>
            <div className="flex gap-2">
              {[
                { name: 'Instagram', icon: '📸', color: '#E1306C' },
                { name: 'YouTube', icon: '▶️', color: '#FF0000' },
                { name: 'TikTok', icon: '🎵', color: '#000000' },
              ].map((p) => (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${p.color}18`, color: p.color }}
                >
                  {p.icon} {p.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
