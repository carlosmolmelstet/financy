import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/class-names'
import './text-link.css'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function TextLink({
  children,
  className,
  href = '#',
  leftIcon,
  rightIcon,
  ...props
}: TextLinkProps) {
  return (
    <a className={cn('ui-text-link', className)} href={href} {...props}>
      {leftIcon ? <span className="ui-text-link__icon">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="ui-text-link__icon">{rightIcon}</span> : null}
    </a>
  )
}
