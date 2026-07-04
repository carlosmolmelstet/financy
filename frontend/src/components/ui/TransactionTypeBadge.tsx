import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { cn } from '../../lib/class-names'
import './transaction-type-badge.css'

type TransactionTypeBadgeProps = {
  type: 'EXPENSE' | 'INCOME'
}

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const isIncome = type === 'INCOME'
  const Icon = isIncome ? CircleArrowUp : CircleArrowDown

  return (
    <span
      className={cn(
        'transaction-type-badge',
        isIncome
          ? 'transaction-type-badge--income'
          : 'transaction-type-badge--expense',
      )}
    >
      <Icon aria-hidden="true" size={16} strokeWidth={2} />
      {isIncome ? 'Entrada' : 'Saída'}
    </span>
  )
}
