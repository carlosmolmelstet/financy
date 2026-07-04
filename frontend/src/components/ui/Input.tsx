import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/class-names'
import './input.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  helperText?: string
  label: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  rightIconButtonProps?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'type'
  > & {
    'aria-label': string
  }
}

export function Input({
  className,
  error,
  helperText,
  id,
  label,
  leftIcon,
  rightIcon,
  rightIconButtonProps,
  ...props
}: InputProps) {
  const inputId = id ?? props.name
  const helperId = inputId ? `${inputId}-helper` : undefined
  const message = error ?? helperText
  const { className: rightIconButtonClassName, ...rightIconButtonRestProps } =
    rightIconButtonProps ?? {}
  const rightIconClassName = cn(
    'ui-field__icon',
    rightIconButtonProps && 'ui-field__icon-button',
    rightIconButtonClassName,
  )

  return (
    <div className={cn('ui-field', className)}>
      <label
        className={cn('ui-field__label', error && 'ui-field__label--error')}
        htmlFor={inputId}
      >
        {label}
      </label>
      <span className={cn('ui-field__control', error && 'ui-field__control--error')}>
        {leftIcon ? <span className="ui-field__icon">{leftIcon}</span> : null}
        <input
          aria-describedby={message ? helperId : undefined}
          aria-invalid={Boolean(error)}
          id={inputId}
          {...props}
        />
        {rightIcon && rightIconButtonProps ? (
          <button
            className={rightIconClassName}
            type="button"
            {...rightIconButtonRestProps}
          >
            {rightIcon}
          </button>
        ) : rightIcon ? (
          <span className={rightIconClassName}>{rightIcon}</span>
        ) : null}
      </span>
      {message ? (
        <span
          className={cn('ui-field__helper', error && 'ui-field__helper--error')}
          id={helperId}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
