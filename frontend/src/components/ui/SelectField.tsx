import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/class-names'
import './select-field.css'

type SelectFieldOption = {
  label: string
  value: string
}

type SelectFieldProps = {
  defaultOpen?: boolean
  defaultValue?: string
  disabled?: boolean
  helperText?: string
  label: string
  leftIcon?: ReactNode
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
  open?: boolean
  options: SelectFieldOption[]
  value?: string
}

export function SelectField({
  defaultOpen = false,
  defaultValue,
  disabled = false,
  helperText,
  label,
  leftIcon,
  onOpenChange,
  onValueChange,
  open,
  options,
  value,
}: SelectFieldProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? '')
  const isOpen = open ?? internalOpen
  const selectedValue = value ?? internalValue
  const selectedOption = options.find((option) => option.value === selectedValue)
  const Icon = isOpen ? ChevronUp : ChevronDown

  const changeOpen = useCallback((nextOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }, [onOpenChange, open])

  function selectOption(nextValue: string) {
    if (disabled) {
      return
    }

    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
    changeOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        changeOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        changeOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [changeOpen, isOpen])

  return (
    <div className={cn('ui-select-field', isOpen && 'is-open')} ref={rootRef}>
      <span className="ui-select-field__label">{label}</span>
      <button
        aria-controls={`${id}-menu`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="ui-select-field__trigger"
        disabled={disabled}
        onClick={() => changeOpen(!isOpen)}
        type="button"
      >
        {leftIcon ? <span className="ui-select-field__icon">{leftIcon}</span> : null}
        <span className="ui-select-field__value">
          {selectedOption?.label ?? 'Selecione'}
        </span>
        <Icon aria-hidden="true" className="ui-select-field__chevron" />
      </button>
      {helperText ? <span className="ui-select-field__helper">{helperText}</span> : null}
      {isOpen ? (
        <div className="ui-select-field__menu" id={`${id}-menu`} role="listbox">
          {options.map((option) => {
            const selected = option.value === selectedValue

            return (
              <button
                aria-selected={selected}
                className="ui-select-field__option"
                disabled={disabled}
                key={option.value}
                onClick={() => selectOption(option.value)}
                role="option"
                type="button"
              >
                <span>{option.label}</span>
                {selected ? <Check aria-hidden="true" size={20} /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
