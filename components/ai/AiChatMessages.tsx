'use client'

import { useEffect, useRef } from 'react'
import type { Message } from 'ai'
import { Sparkles } from 'lucide-react'

interface AiChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function AiChatMessages({ messages, isLoading }: AiChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">AI Script Assistant</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Ask me to improve your hook, rewrite the CTA, adjust the tone, or anything else.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
              max-w-[90%] rounded-xl px-3 py-2.5 text-sm leading-relaxed
              ${message.role === 'user'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-800 border border-gray-100'
              }
            `}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
