'use client'

import { useChat } from 'ai/react'
import { useEffect } from 'react'
import { AiChatMessages } from '@/components/ai/AiChatMessages'
import { AiChatInput } from '@/components/ai/AiChatInput'
import { ClipboardCopy, Trash2 } from 'lucide-react'
import type { AiMessage } from '@/lib/types'
import { toast } from 'sonner'

interface AiSidebarProps {
  cardId: string
  cardTitle: string
  cardScript: string
  initialMessages?: AiMessage[]
  onInsertIntoScript: (text: string) => void
}

export function AiSidebar({
  cardId,
  cardTitle,
  cardScript,
  initialMessages = [],
  onInsertIntoScript,
}: AiSidebarProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setMessages } =
    useChat({
      api: '/api/ai/chat',
      body: {
        cardScript,
        cardTitle,
      },
      initialMessages: initialMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
      })),
      onError: () => {
        toast.error('AI request failed. Check your API key.')
      },
    })

  // Persist messages to DB after each assistant response
  useEffect(() => {
    if (messages.length === 0 || isLoading) return
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role !== 'assistant') return

    fetch(`/api/cards/${cardId}/ai-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    }).catch(() => {})
  }, [messages, isLoading, cardId])

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')

  function handleInsert() {
    if (lastAssistantMessage) {
      onInsertIntoScript(lastAssistantMessage.content)
      toast.success('Inserted into script')
    }
  }

  function handleClear() {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-full border-l border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center">
            <span className="text-[10px]">✦</span>
          </div>
          <span className="text-xs font-semibold text-gray-700">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          {lastAssistantMessage && (
            <button
              onClick={handleInsert}
              title="Insert last response into script"
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
            >
              <ClipboardCopy className="h-3 w-3" />
              Insert
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              title="Clear conversation"
              className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors rounded-lg hover:bg-gray-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <AiChatMessages messages={messages} isLoading={isLoading} />

      {/* Input */}
      <AiChatInput
        input={input}
        isLoading={isLoading}
        onChange={(v) => handleInputChange({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>)}
        onSubmit={handleSubmit}
        onStop={stop}
      />
    </div>
  )
}
