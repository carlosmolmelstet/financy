import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/class-names'
import './pagination-button.css'

type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

export function PaginationButton({
  active = false,
  children,
  className,
  type = 'button',
  ...props
}: PaginationButtonProps) {
  return (
    <button
      className={cn('ui-pagination-button', active && 'is-active', className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
