import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/class-names'
import './tag.css'

export type TagTone =
  | 'blue'
  | 'green'
  | 'gray'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'yellow'

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: TagTone
}

export function Tag({ children, className, tone = 'gray', ...props }: TagProps) {
  return (
    <span className={cn('ui-tag', `ui-tag--${tone}`, className)} {...props}>
      {children}
    </span>
  )
}
