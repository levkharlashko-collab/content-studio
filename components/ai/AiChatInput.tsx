'use client'

import { useRef, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Square } from 'lucide-react'

interface AiChatInputProps {
  input: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onStop: () => void
}

export function AiChatInput({ input, isLoading, onChange, onSubmit, onStop }: AiChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) {
        onSubmit(e as unknown as FormEvent)
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
    // Auto-resize
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
    }
  }

  return (
    <div className="px-3 pb-3">
      <div className="flex items-end gap-2 border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-gray-900 transition-shadow bg-white">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to improve your script…"
          rows={1}
          className="flex-1 text-sm text-gray-800 resize-none outline-none placeholder:text-gray-400 leading-relaxed max-h-40 bg-transparent"
          style={{ height: '36px' }}
        />
        <button
          onClick={isLoading ? onStop : (e) => { e.preventDefault(); onSubmit(e) }}
          disabled={!isLoading && !input.trim()}
          className="shrink-0 w-7 h-7 flex items-center justify-center bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Square className="h-3 w-3" /> : <ArrowUp className="h-3.5 w-3.5" />}
        </button>
      </div>
      <p className="text-[10px] text-gray-300 mt-1.5 ml-1">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  )
}
