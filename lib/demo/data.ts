import type { Stage, Card, Platform } from '@/lib/types'

export const DEMO_PLATFORMS: Platform[] = [
  { id: 'p1', name: 'Instagram', icon: '📸', color: '#E1306C' },
  { id: 'p2', name: 'YouTube', icon: '▶️', color: '#FF0000' },
  { id: 'p3', name: 'TikTok', icon: '🎵', color: '#000000' },
]

export const DEMO_STAGES: Stage[] = [
  { id: 's1', user_id: 'demo', name: 'Idea', position: 0, color: '#FEF9C3', created_at: '' },
  { id: 's2', user_id: 'demo', name: 'Research', position: 1, color: '#DBEAFE', created_at: '' },
  { id: 's3', user_id: 'demo', name: 'Scripting', position: 2, color: '#F3E8FF', created_at: '' },
  { id: 's4', user_id: 'demo', name: 'Review', position: 3, color: '#FEE2E2', created_at: '' },
  { id: 's5', user_id: 'demo', name: 'Published', position: 4, color: '#DCFCE7', created_at: '' },
]

export const DEMO_CARDS: Card[] = [
  {
    id: 'c1', user_id: 'demo', stage_id: 's1',
    title: '5 morning habits that changed my life',
    description: 'Talk about journaling, cold shower, no phone first 30 min, reading, and movement.',
    script: null, position: 1000,
    platforms: [DEMO_PLATFORMS[0], DEMO_PLATFORMS[2]],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'c2', user_id: 'demo', stage_id: 's1',
    title: 'Why I deleted Instagram for 30 days',
    description: 'Personal story + data on productivity improvement.',
    script: null, position: 2000,
    platforms: [DEMO_PLATFORMS[1]],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'c3', user_id: 'demo', stage_id: 's2',
    title: 'How I built a $10k/mo newsletter',
    description: 'Research: competitor newsletters, monetization models, growth strategies.',
    script: null, position: 1000,
    platforms: [DEMO_PLATFORMS[1], DEMO_PLATFORMS[0]],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'c4', user_id: 'demo', stage_id: 's3',
    title: 'The only productivity system you need',
    description: 'Cover: time blocking, priority matrix, weekly review ritual.',
    script: `Hook: "I wasted 3 years trying every productivity app. Then I discovered this."

[Cut to desk setup]

The problem isn't that you don't have the right tools. It's that you have too many.

Here's the system I've used for the last 2 years — and it fits on one piece of paper.

Step 1: The night-before list
Every evening, write down your top 3 priorities for tomorrow. Not 10. Not 5. Three.

Step 2: Time blocking
Block your first 2 hours for deep work. No meetings, no email, no Slack.

Step 3: The weekly review
Every Sunday, 20 minutes. What worked? What didn't? What's next week's focus?

That's it. No app required.

CTA: "Drop a 🔥 if you're trying this today."`,
    position: 1000,
    platforms: [DEMO_PLATFORMS[0], DEMO_PLATFORMS[2]],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'c5', user_id: 'demo', stage_id: 's4',
    title: 'Books that made me $100k',
    description: 'Ready for final review before posting.',
    script: `Hook: "These 4 books changed how I think about money."\n\nLet's go through each one...`,
    position: 1000,
    platforms: [DEMO_PLATFORMS[1]],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'c6', user_id: 'demo', stage_id: 's5',
    title: 'How to wake up at 5am (and actually enjoy it)',
    description: 'Published — 2.3M views on TikTok.',
    script: `Hook: "I've been waking up at 5am for 500 days. Here's what nobody tells you."`,
    position: 1000,
    platforms: [DEMO_PLATFORMS[2]],
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
]
