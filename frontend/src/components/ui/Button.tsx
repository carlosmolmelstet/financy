import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/class-names'
import './button.css'

type ButtonVariant = 'solid' | 'outline'
type ButtonSize = 'md' | 'sm'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
}

export function Button({
  children,
  className,
  icon,
  size = 'md',
  variant = 'solid',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
      type={type}
      {...props}
    >
      {icon ? <span className="ui-button__icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
