'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/board', icon: LayoutGrid, label: 'Board' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-gray-100 bg-white flex flex-col h-full">
      {/* Logo */}
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

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href || (href !== '/board' && pathname.startsWith(href))
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
