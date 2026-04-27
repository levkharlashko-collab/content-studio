'use client'

import { useState } from 'react'
import { useDemoStore } from '@/lib/demo/store'
import { Separator } from '@/components/ui/separator'
import { Plus, GripVertical, Pencil, Trash2, Check, X, LayoutGrid, Settings } from 'lucide-react'
import { STAGE_COLORS, STAGE_TEXT_COLORS } from '@/lib/types'
import { toast } from 'sonner'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Toaster } from 'sonner'

export default function SettingsPage() {
  const store = useDemoStore()
  const [newStageName, setNewStageName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const pathname = usePathname()

  async function handleAddStage(e: React.FormEvent) {
    e.preventDefault()
    if (!newStageName.trim()) return
    store.createStage(newStageName.trim())
    setNewStageName('')
    toast.success('Stage added')
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
            <Link key={href} href={href}
              className={cn('flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === href ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />{label}
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-12 shrink-0 border-b border-gray-100 bg-white flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-gray-900">Settings</h1>
          <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full">
            Demo — data saved in browser only
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-6 py-8 space-y-10">
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Stages</h2>
              <p className="text-xs text-gray-400 mb-4">Customize the columns on your board.</p>
              <div className="space-y-1.5">
                {store.stages.map((stage) => {
                  const bg = stage.color ?? STAGE_COLORS[stage.name] ?? '#F8F9FA'
                  const text = STAGE_TEXT_COLORS[stage.name] ?? '#374151'
                  return (
                    <div key={stage.id} className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-xl group">
                      <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
                      {editingId === stage.id ? (
                        <input autoFocus value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { store.updateStage(stage.id, { name: editingName.trim() }); setEditingId(null); toast.success('Stage renamed') }
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                          className="flex-1 text-sm outline-none border-b border-gray-300 pb-0.5"
                        />
                      ) : (
                        <span className="flex-1">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: bg, color: text }}>{stage.name}</span>
                        </span>
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingId === stage.id ? (
                          <>
                            <button onClick={() => { store.updateStage(stage.id, { name: editingName.trim() }); setEditingId(null); toast.success('Renamed') }} className="p-1 text-green-500 hover:text-green-700"><Check className="h-3.5 w-3.5" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-gray-400"><X className="h-3.5 w-3.5" /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingId(stage.id); setEditingName(stage.name) }} className="p-1 text-gray-300 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                            <button onClick={() => { if (!confirm(`Delete "${stage.name}"?`)) return; store.deleteStage(stage.id); toast.success('Deleted') }} className="p-1 text-gray-300 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <form onSubmit={handleAddStage} className="flex gap-2 mt-3">
                <input value={newStageName} onChange={(e) => setNewStageName(e.target.value)} placeholder="New stage name…"
                  className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-300"
                />
                <button type="submit" disabled={!newStageName.trim()}
                  className="flex items-center gap-1.5 px-3 h-9 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors">
                  <Plus className="h-4 w-4" />Add
                </button>
              </form>
            </section>

            <Separator />

            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Platforms</h2>
              <p className="text-xs text-gray-400 mb-4">Available platform labels.</p>
              <div className="flex gap-2">
                {[{ name: 'Instagram', icon: '📸', color: '#E1306C' }, { name: 'YouTube', icon: '▶️', color: '#FF0000' }, { name: 'TikTok', icon: '🎵', color: '#000000' }].map((p) => (
                  <span key={p.name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${p.color}18`, color: p.color }}>
                    {p.icon} {p.name}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
