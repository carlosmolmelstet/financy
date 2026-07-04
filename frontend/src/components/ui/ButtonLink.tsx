import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/class-names'
import type { ButtonSize, ButtonVariant } from './Button'
import './button.css'

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
}

export function ButtonLink({
  children,
  className,
  icon,
  size = 'md',
  variant = 'solid',
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
      {...props}
    >
      {icon ? <span className="ui-button__icon">{icon}</span> : null}
      <span>{children}</span>
    </a>
  )
}
