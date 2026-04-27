import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string
}

function Badge({ className, color, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        className
      )}
      style={{
        backgroundColor: color ? `${color}18` : undefined,
        color: color ?? undefined,
        ...style,
      }}
      {...props}
    />
  )
}

export { Badge }
