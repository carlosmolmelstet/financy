import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/class-names'
import './button.css'

type IconButtonVariant = 'outline' | 'danger'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  label: string
  variant?: IconButtonVariant
}

export function IconButton({
  children,
  className,
  label,
  type = 'button',
  variant = 'outline',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn('ui-icon-button', `ui-icon-button--${variant}`, className)}
      title={label}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
