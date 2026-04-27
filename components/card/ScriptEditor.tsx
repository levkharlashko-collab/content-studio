'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ScriptEditorProps {
  value: string
  onChange: (value: string) => void
  onSave: (value: string) => void
}

export function ScriptEditor({ value, onChange, onSave }: ScriptEditorProps) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${ta.scrollHeight}px`
    }
  }, [value])

  const debouncedSave = useCallback(
    (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setSaveState('saving')
      timerRef.current = setTimeout(async () => {
        await onSave(text)
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 2000)
      }, 800)
    },
    [onSave]
  )

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
    debouncedSave(e.target.value)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Script
        </label>
        <span className="text-[10px] text-gray-300 transition-opacity">
          {saveState === 'saving' && 'Saving…'}
          {saveState === 'saved' && 'Saved'}
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="Write your script here…&#10;&#10;Start with a strong hook that grabs attention in the first 3 seconds."
        className="w-full min-h-[240px] text-sm text-gray-800 leading-relaxed resize-none outline-none placeholder:text-gray-300 bg-transparent"
        style={{ height: 'auto' }}
      />
    </div>
  )
}
