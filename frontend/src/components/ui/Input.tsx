import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/class-names'
import './input.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  helperText?: string
  label: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Input({
  className,
  error,
  helperText,
  id,
  label,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const inputId = id ?? props.name
  const helperId = inputId ? `${inputId}-helper` : undefined
  const message = error ?? helperText

  return (
    <label className={cn('ui-field', className)} htmlFor={inputId}>
      <span className={cn('ui-field__label', error && 'ui-field__label--error')}>
        {label}
      </span>
      <span className={cn('ui-field__control', error && 'ui-field__control--error')}>
        {leftIcon ? <span className="ui-field__icon">{leftIcon}</span> : null}
        <input
          aria-describedby={message ? helperId : undefined}
          aria-invalid={Boolean(error)}
          id={inputId}
          {...props}
        />
        {rightIcon ? <span className="ui-field__icon">{rightIcon}</span> : null}
      </span>
      {message ? (
        <span
          className={cn('ui-field__helper', error && 'ui-field__helper--error')}
          id={helperId}
        >
          {message}
        </span>
      ) : null}
    </label>
  )
}
