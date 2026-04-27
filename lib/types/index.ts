export type Platform = {
  id: string
  name: string
  icon: string
  color: string
}

export type Stage = {
  id: string
  user_id: string
  name: string
  position: number
  color: string | null
  created_at: string
}

export type Card = {
  id: string
  user_id: string
  stage_id: string
  title: string
  description: string | null
  script: string | null
  position: number
  created_at: string
  updated_at: string
  platforms: Platform[]
}

export type AiMessage = {
  id: string
  card_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export type CardWithStage = Card & {
  stage: Stage
}

export const PLATFORM_COLORS: Record<string, string> = {
  Instagram: '#E1306C',
  YouTube: '#FF0000',
  TikTok: '#000000',
}

export const STAGE_COLORS: Record<string, string> = {
  Idea: '#FEF9C3',
  Research: '#DBEAFE',
  Scripting: '#F3E8FF',
  Review: '#FEE2E2',
  Published: '#DCFCE7',
}

export const STAGE_TEXT_COLORS: Record<string, string> = {
  Idea: '#92400E',
  Research: '#1E40AF',
  Scripting: '#6B21A8',
  Review: '#991B1B',
  Published: '#166534',
}
