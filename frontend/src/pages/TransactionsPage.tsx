import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  AlertCircle,
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  Pencil,
  PiggyBank,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  ShoppingCart,
  Tag as TagIcon,
  Ticket,
  ToolCase,
  Trash2,
  Utensils,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  createTransaction,
  deleteTransaction,
  getTransactionsData,
  updateTransaction,
  type TransactionCategory,
  type TransactionFormInput,
  type TransactionListItem,
  type TransactionType,
  type TransactionsData,
} from '../graphql/transactions'
import { getAuthToken } from '../lib/auth-session'
import { cn } from '../lib/class-names'
import {
  Button,
  IconButton,
  Input,
  PaginationButton,
  SelectField,
  Tag,
  TransactionTypeBadge,
} from '../components/ui'
import './transactions-page.css'

type TransactionsState =
  | { status: 'error'; message: string }
  | { status: 'loading' }
  | { data: TransactionsData; status: 'success' }

type TransactionFilters = {
  category: string
  period: string | null
  search: string
  type: string
}

type TransactionModalState =
  | { mode: 'create' }
  | { mode: 'edit'; transaction: TransactionListItem }
  | null

type DeleteTransactionModalState = { transaction: TransactionListItem } | null

type TransactionFormValues = {
  amount: string
  categoryId: string
  description: string
  transactionDate: string
  type: TransactionType
}

type TransactionFormErrors = Partial<Record<keyof TransactionFormValues | 'form', string>>

type SelectOption = {
  label: string
  value: string
}

const pageSize = 8
const allCategoriesValue = 'all'
const allPeriodsValue = 'all'
const allTypesValue = 'all'
const noCategoryValue = 'none'
const uncategorizedValue = 'uncategorized'

const initialFilters: TransactionFilters = {
  category: allCategoriesValue,
  period: null,
  search: '',
  type: allTypesValue,
}

const typeOptions: SelectOption[] = [
  { label: 'Todos', value: allTypesValue },
  { label: 'Entrada', value: 'INCOME' },
  { label: 'Saída', value: 'EXPENSE' },
]

const defaultTransactionFormValues: TransactionFormValues = {
  amount: '',
  categoryId: noCategoryValue,
  description: '',
  transactionDate: '',
  type: 'EXPENSE',
}

const skeletonRows = Array.from({ length: pageSize }, (_, index) => index)

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
  year: '2-digit',
})

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const categoryIconByName: Record<string, LucideIcon> = {
  'baggage-claim': BaggageClaim,
  'book-open': BookOpen,
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  dumbbell: Dumbbell,
  gift: Gift,
  'heart-pulse': HeartPulse,
  house: House,
  mailbox: Mailbox,
  'piggy-bank': PiggyBank,
  'receipt-text': ReceiptText,
  'shopping-cart': ShoppingCart,
  tag: TagIcon,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  wallet: Wallet,
}

function getTransactionsErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Tente novamente mais tarde.'
}

function getPeriodKey(isoDate: string): string {
  const date = new Date(isoDate)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

function formatPeriodLabel(periodKey: string): string {
  const [year = '', month = ''] = periodKey.split('-')
  const monthIndex = Number(month) - 1
  const monthName = monthNames[monthIndex] ?? month

  return `${monthName} / ${year}`
}

function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}

function formatDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10)
}

function formatCurrency(value: number): string {
  return currencyFormatter.format(value).replace(/\s/g, ' ')
}

function formatAmountInputValue(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount)
}

function sanitizeAmountInputValue(value: string): string {
  const sanitizedValue = value.replace(/[^\d,]/g, '')
  const [integerPart = '', ...decimalParts] = sanitizedValue.split(',')

  if (!sanitizedValue.includes(',')) {
    return integerPart
  }

  const decimalPart = decimalParts.join('').slice(0, 2)

  return `${integerPart || '0'},${decimalPart}`
}

function formatTransactionAmount(transaction: TransactionListItem): string {
  const sign = transaction.type === 'INCOME' ? '+' : '-'

  return `${sign} ${formatCurrency(transaction.amount)}`
}

function parseAmountInputValue(value: string): number {
  const cleanedValue = value.trim().replace(/[^\d,.-]/g, '')

  if (!cleanedValue) {
    return Number.NaN
  }

  if (cleanedValue.includes(',')) {
    return Number(cleanedValue.replace(/\./g, '').replace(',', '.'))
  }

  return Number(cleanedValue)
}

function getTransactionMutationErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Não foi possível salvar a transação.'
  }

  if (error.message === 'Transaction description must have at least 2 characters') {
    return 'A descrição deve ter pelo menos 2 caracteres.'
  }

  if (error.message === 'Transaction description must have at most 140 characters') {
    return 'A descrição deve ter no máximo 140 caracteres.'
  }

  if (error.message === 'Transaction amount must be greater than zero') {
    return 'O valor deve ser maior que zero.'
  }

  if (error.message === 'Transaction amount must be a valid number') {
    return 'Informe um valor válido.'
  }

  if (error.message === 'Transaction date must be a valid date') {
    return 'Informe uma data válida.'
  }

  if (error.message === 'Category not found') {
    return 'Categoria não encontrada.'
  }

  if (error.message === 'Transaction not found') {
    return 'Transação não encontrada.'
  }

  return error.message || 'Não foi possível salvar a transação.'
}

function getTransactionDeleteErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Não foi possível excluir a transação.'
  }

  if (error.message === 'Transaction not found') {
    return 'Transação não encontrada.'
  }

  return error.message || 'Não foi possível excluir a transação.'
}

function getTransactionFormValuesFromModal(
  modal: Exclude<TransactionModalState, null>,
): TransactionFormValues {
  if (modal.mode === 'create') {
    return defaultTransactionFormValues
  }

  return {
    amount: formatAmountInputValue(modal.transaction.amount),
    categoryId: modal.transaction.categoryId ?? noCategoryValue,
    description: modal.transaction.description,
    transactionDate: formatDateInputValue(modal.transaction.transactionDate),
    type: modal.transaction.type,
  }
}

function validateTransactionForm(values: TransactionFormValues): TransactionFormErrors {
  const errors: TransactionFormErrors = {}
  const trimmedDescription = values.description.trim()
  const amount = parseAmountInputValue(values.amount)

  if (!trimmedDescription) {
    errors.description = 'Informe a descrição.'
  } else if (trimmedDescription.length < 2) {
    errors.description = 'A descrição deve ter pelo menos 2 caracteres.'
  } else if (trimmedDescription.length > 140) {
    errors.description = 'A descrição deve ter no máximo 140 caracteres.'
  }

  if (!values.transactionDate) {
    errors.transactionDate = 'Informe a data.'
  } else if (Number.isNaN(new Date(`${values.transactionDate}T12:00:00.000Z`).getTime())) {
    errors.transactionDate = 'Informe uma data válida.'
  }

  if (!Number.isFinite(amount)) {
    errors.amount = 'Informe um valor válido.'
  } else if (amount <= 0) {
    errors.amount = 'O valor deve ser maior que zero.'
  }

  if (values.type !== 'EXPENSE' && values.type !== 'INCOME') {
    errors.type = 'Selecione o tipo.'
  }

  return errors
}

function hasTransactionFormErrors(errors: TransactionFormErrors): boolean {
  return Object.values(errors).some(Boolean)
}

function getTransactionFormInput(values: TransactionFormValues): TransactionFormInput {
  return {
    amount: parseAmountInputValue(values.amount),
    categoryId: values.categoryId === noCategoryValue ? null : values.categoryId,
    description: values.description.trim(),
    transactionDate: new Date(`${values.transactionDate}T12:00:00.000Z`).toISOString(),
    type: values.type,
  }
}

function normalizeSearchValue(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function buildPeriodOptions(transactions: TransactionListItem[]): SelectOption[] {
  const periodKeys = Array.from(
    new Set(transactions.map((transaction) => getPeriodKey(transaction.transactionDate))),
  ).sort((first, second) => second.localeCompare(first))

  if (periodKeys.length === 0) {
    return [{ label: 'Todos os períodos', value: allPeriodsValue }]
  }

  return [
    ...periodKeys.map((periodKey) => ({
      label: formatPeriodLabel(periodKey),
      value: periodKey,
    })),
    { label: 'Todos os períodos', value: allPeriodsValue },
  ]
}

function buildCategoryOptions(
  categories: TransactionCategory[],
  transactions: TransactionListItem[],
): SelectOption[] {
  const hasUncategorizedTransactions = transactions.some((transaction) => !transaction.category)

  return [
    { label: 'Todas', value: allCategoriesValue },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
    ...(hasUncategorizedTransactions
      ? [{ label: 'Sem categoria', value: uncategorizedValue }]
      : []),
  ]
}

function filterTransactions(
  transactions: TransactionListItem[],
  filters: TransactionFilters,
  period: string,
): TransactionListItem[] {
  const search = normalizeSearchValue(filters.search)

  return transactions.filter((transaction) => {
    if (search && !normalizeSearchValue(transaction.description).includes(search)) {
      return false
    }

    if (filters.type !== allTypesValue && transaction.type !== filters.type) {
      return false
    }

    if (filters.category === uncategorizedValue && transaction.category) {
      return false
    }

    if (
      filters.category !== allCategoriesValue &&
      filters.category !== uncategorizedValue &&
      transaction.categoryId !== filters.category
    ) {
      return false
    }

    if (period !== allPeriodsValue && getPeriodKey(transaction.transactionDate) !== period) {
      return false
    }

    return true
  })
}

function getVisiblePages(currentPage: number, pageCount: number): number[] {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  if (pages.length <= 3) {
    return pages
  }

  if (currentPage <= 2) {
    return pages.slice(0, 3)
  }

  if (currentPage >= pageCount - 1) {
    return pages.slice(-3)
  }

  return [currentPage - 1, currentPage, currentPage + 1]
}

function TransactionCategoryIcon({
  category,
}: {
  category: TransactionCategory | null
}) {
  const Icon = category?.icon ? categoryIconByName[category.icon] ?? TagIcon : TagIcon
  const tone = category?.tone ?? 'gray'

  return (
    <span className={cn('transactions-category-icon', `transactions-category-icon--${tone}`)}>
      <Icon aria-hidden="true" />
    </span>
  )
}

function TransactionsHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="transactions-page__header">
      <div className="transactions-page__heading">
        <h1>Transações</h1>
        <p>Gerencie todas as suas transações financeiras</p>
      </div>

      <Button icon={<Plus aria-hidden="true" />} onClick={onCreate} size="sm">
        Nova transação
      </Button>
    </header>
  )
}

function TransactionsFilters({
  categoryOptions,
  filters,
  onFilterChange,
  period,
  periodOptions,
}: {
  categoryOptions: SelectOption[]
  filters: TransactionFilters
  onFilterChange: <TField extends keyof TransactionFilters>(
    field: TField,
    value: TransactionFilters[TField],
  ) => void
  period: string
  periodOptions: SelectOption[]
}) {
  return (
    <section className="transactions-filters" aria-label="Filtros de transações">
      <Input
        autoComplete="off"
        label="Buscar"
        leftIcon={<Search aria-hidden="true" />}
        name="transaction-search"
        onChange={(event) => onFilterChange('search', event.target.value)}
        placeholder="Buscar por descrição"
        value={filters.search}
      />

      <SelectField
        label="Tipo"
        onValueChange={(value) => onFilterChange('type', value)}
        options={typeOptions}
        value={filters.type}
      />

      <SelectField
        label="Categoria"
        onValueChange={(value) => onFilterChange('category', value)}
        options={categoryOptions}
        value={filters.category}
      />

      <SelectField
        label="Período"
        onValueChange={(value) => onFilterChange('period', value)}
        options={periodOptions}
        value={period}
      />
    </section>
  )
}

function TransactionModal({
  categories,
  modal,
  onClose,
  onSubmit,
}: {
  categories: TransactionCategory[]
  modal: Exclude<TransactionModalState, null>
  onClose: () => void
  onSubmit: (values: TransactionFormValues) => Promise<void>
}) {
  const [values, setValues] = useState<TransactionFormValues>(() =>
    getTransactionFormValuesFromModal(modal),
  )
  const [errors, setErrors] = useState<TransactionFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const title = modal.mode === 'create' ? 'Nova transação' : 'Editar transação'
  const subtitle =
    modal.mode === 'create'
      ? 'Registre sua despesa ou receita'
      : 'Atualize sua despesa ou receita'
  const categoryOptions: SelectOption[] = [
    { label: 'Selecione', value: noCategoryValue },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ]

  useEffect(() => {
    setValues(getTransactionFormValuesFromModal(modal))
    setErrors({})
    setIsSubmitting(false)
  }, [modal])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSubmitting, onClose])

  function updateField<TField extends keyof TransactionFormValues>(
    field: TField,
    value: TransactionFormValues[TField],
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
      form: undefined,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateTransactionForm(values)
    setErrors(nextErrors)

    if (hasTransactionFormErrors(nextErrors)) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(values)
    } catch (error) {
      setErrors({
        form: getTransactionMutationErrorMessage(error),
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div
      aria-labelledby="transaction-modal-title"
      aria-modal="true"
      className="transactions-modal-overlay"
      role="dialog"
    >
      <form className="transactions-modal" noValidate onSubmit={handleSubmit}>
        <header className="transactions-modal__header">
          <div className="transactions-modal__heading">
            <h2 id="transaction-modal-title">{title}</h2>
            <p>{subtitle}</p>
          </div>

          <IconButton disabled={isSubmitting} label="Fechar modal" onClick={onClose}>
            <X aria-hidden="true" />
          </IconButton>
        </header>

        <fieldset className="transactions-modal-type">
          <legend className="transactions-sr-only">Tipo da transação</legend>
          <button
            aria-pressed={values.type === 'EXPENSE'}
            className={cn(
              'transactions-modal-type__button',
              values.type === 'EXPENSE' && 'transactions-modal-type__button--expense',
            )}
            disabled={isSubmitting}
            onClick={() => updateField('type', 'EXPENSE')}
            type="button"
          >
            <CircleArrowDown aria-hidden="true" />
            Despesa
          </button>
          <button
            aria-pressed={values.type === 'INCOME'}
            className={cn(
              'transactions-modal-type__button',
              values.type === 'INCOME' && 'transactions-modal-type__button--income',
            )}
            disabled={isSubmitting}
            onClick={() => updateField('type', 'INCOME')}
            type="button"
          >
            <CircleArrowUp aria-hidden="true" />
            Receita
          </button>
        </fieldset>
        {errors.type ? (
          <span className="transactions-modal__field-error">{errors.type}</span>
        ) : null}

        <div className="transactions-modal__form">
          <Input
            autoComplete="off"
            disabled={isSubmitting}
            error={errors.description}
            label="Descrição"
            name="transaction-description"
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Ex. Almoço no restaurante"
            value={values.description}
          />

          <div className="transactions-modal__line">
            <Input
              disabled={isSubmitting}
              error={errors.transactionDate}
              label="Data"
              name="transaction-date"
              onChange={(event) => updateField('transactionDate', event.target.value)}
              type="date"
              value={values.transactionDate}
            />

            <Input
              autoComplete="off"
              disabled={isSubmitting}
              error={errors.amount}
              inputMode="decimal"
              label="Valor"
              leftIcon={<span className="transactions-modal__currency-prefix">R$</span>}
              name="transaction-amount"
              onChange={(event) =>
                updateField('amount', sanitizeAmountInputValue(event.target.value))
              }
              pattern="[0-9]*,?[0-9]{0,2}"
              placeholder="0,00"
              value={values.amount}
            />
          </div>

          <div className="transactions-modal__category">
            <SelectField
              disabled={isSubmitting}
              label="Categoria"
              onValueChange={(value) => updateField('categoryId', value)}
              options={categoryOptions}
              value={values.categoryId}
            />
            {errors.categoryId ? (
              <span className="transactions-modal__field-error">
                {errors.categoryId}
              </span>
            ) : null}
          </div>
        </div>

        {errors.form ? (
          <p className="transactions-modal__alert" role="alert">
            {errors.form}
          </p>
        ) : null}

        <Button className="transactions-modal__submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  )
}

function DeleteTransactionModal({
  modal,
  onClose,
  onSubmit,
}: {
  modal: Exclude<DeleteTransactionModalState, null>
  onClose: () => void
  onSubmit: (transaction: TransactionListItem) => Promise<void>
}) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const transaction = modal.transaction

  useEffect(() => {
    setError(null)
    setIsSubmitting(false)
  }, [modal])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSubmitting, onClose])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(transaction)
    } catch (submitError) {
      setError(getTransactionDeleteErrorMessage(submitError))
      setIsSubmitting(false)
    }
  }

  return (
    <div
      aria-labelledby="transaction-delete-modal-title"
      aria-modal="true"
      className="transactions-modal-overlay"
      role="dialog"
    >
      <form
        className="transactions-modal transactions-delete-modal"
        noValidate
        onSubmit={handleSubmit}
      >
        <header className="transactions-modal__header">
          <div className="transactions-modal__heading">
            <h2 id="transaction-delete-modal-title">Excluir transação?</h2>
            <p>Essa ação não poderá ser desfeita.</p>
          </div>

          <IconButton disabled={isSubmitting} label="Fechar modal" onClick={onClose}>
            <X aria-hidden="true" />
          </IconButton>
        </header>

        <div className="transactions-delete-modal__body">
          <span className="transactions-delete-modal__icon">
            <Trash2 aria-hidden="true" />
          </span>

          <div className="transactions-delete-modal__copy">
            <strong>{transaction.description}</strong>
            <span>
              Tem certeza que deseja excluir esta transação de{' '}
              {formatTransactionAmount(transaction)}?
            </span>
            <small>
              {formatDate(transaction.transactionDate)}
              {transaction.category ? ` - ${transaction.category.name}` : ' - Sem categoria'}
            </small>
          </div>
        </div>

        {error ? (
          <p className="transactions-modal__alert" role="alert">
            {error}
          </p>
        ) : null}

        <div className="transactions-delete-modal__actions">
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="outline">
            Cancelar
          </Button>
          <Button
            className="transactions-delete-modal__confirm"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Excluindo...' : 'Excluir transação'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function TransactionsSkeletonBlock({ className }: { className?: string }) {
  return <span className={cn('transactions-skeleton', className)} aria-hidden="true" />
}

function TransactionsLoading() {
  return (
    <section className="transactions-page" aria-busy="true" aria-label="Transações">
      <span className="transactions-sr-only" role="status">
        Carregando transações...
      </span>

      <TransactionsHeader onCreate={() => undefined} />

      <section className="transactions-filters" aria-label="Filtros de transações">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="transactions-filter-skeleton" key={index}>
            <TransactionsSkeletonBlock className="transactions-skeleton--filter-label" />
            <TransactionsSkeletonBlock className="transactions-skeleton--filter-input" />
          </div>
        ))}
      </section>

      <section className="transactions-table-card" aria-label="Lista de transações">
        <div className="transactions-table__scroll">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Data</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((row) => (
                <tr key={row}>
                  <td>
                    <div className="transactions-table__description">
                      <TransactionsSkeletonBlock className="transactions-skeleton--avatar" />
                      <TransactionsSkeletonBlock className="transactions-skeleton--description" />
                    </div>
                  </td>
                  <td>
                    <TransactionsSkeletonBlock className="transactions-skeleton--date" />
                  </td>
                  <td>
                    <TransactionsSkeletonBlock className="transactions-skeleton--tag" />
                  </td>
                  <td>
                    <TransactionsSkeletonBlock className="transactions-skeleton--type" />
                  </td>
                  <td>
                    <TransactionsSkeletonBlock className="transactions-skeleton--amount" />
                  </td>
                  <td>
                    <div className="transactions-table__actions">
                      <TransactionsSkeletonBlock className="transactions-skeleton--action" />
                      <TransactionsSkeletonBlock className="transactions-skeleton--action" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

function TransactionsStateCard({
  action,
  message,
  title,
  variant = 'empty',
}: {
  action?: ReactNode
  message: string
  title: string
  variant?: 'empty' | 'error'
}) {
  return (
    <div className={cn('transactions-state-card', `transactions-state-card--${variant}`)}>
      <span className="transactions-state-card__icon">
        {variant === 'error' ? (
          <AlertCircle aria-hidden="true" />
        ) : (
          <ReceiptText aria-hidden="true" />
        )}
      </span>
      <div className="transactions-state-card__copy">
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
      {action}
    </div>
  )
}

function TransactionsError({
  onCreate,
  message,
  onRetry,
}: {
  onCreate: () => void
  message: string
  onRetry: () => void
}) {
  return (
    <section className="transactions-page" aria-label="Transações">
      <TransactionsHeader onCreate={onCreate} />

      <TransactionsStateCard
        action={
          <Button icon={<RefreshCw aria-hidden="true" />} onClick={onRetry} size="sm">
            Tentar novamente
          </Button>
        }
        message={message}
        title="Erro ao carregar transações"
        variant="error"
      />
    </section>
  )
}

function TransactionsEmpty({
  categoryOptions,
  filters,
  onCreate,
  onFilterChange,
  period,
  periodOptions,
}: {
  categoryOptions: SelectOption[]
  filters: TransactionFilters
  onCreate: () => void
  onFilterChange: <TField extends keyof TransactionFilters>(
    field: TField,
    value: TransactionFilters[TField],
  ) => void
  period: string
  periodOptions: SelectOption[]
}) {
  return (
    <section className="transactions-page" aria-label="Transações">
      <TransactionsHeader onCreate={onCreate} />
      <TransactionsFilters
        categoryOptions={categoryOptions}
        filters={filters}
        onFilterChange={onFilterChange}
        period={period}
        periodOptions={periodOptions}
      />
      <TransactionsStateCard
        message="Cadastre uma transação para acompanhar entradas e saídas."
        title="Nenhuma transação cadastrada"
      />
    </section>
  )
}

function TransactionsFilteredEmpty() {
  return (
    <TransactionsStateCard
      message="Ajuste os filtros para visualizar outras movimentações."
      title="Nenhuma transação encontrada"
    />
  )
}

function TransactionsTable({
  currentPage,
  onDelete,
  onEdit,
  onPageChange,
  pageCount,
  transactions,
  totalTransactions,
}: {
  currentPage: number
  onDelete: (transaction: TransactionListItem) => void
  onEdit: (transaction: TransactionListItem) => void
  onPageChange: (page: number) => void
  pageCount: number
  transactions: TransactionListItem[]
  totalTransactions: number
}) {
  const firstResult = totalTransactions === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastResult = Math.min(currentPage * pageSize, totalTransactions)
  const visiblePages = getVisiblePages(currentPage, pageCount)

  return (
    <section className="transactions-table-card" aria-label="Lista de transações">
      <div className="transactions-table__scroll">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Data</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <div className="transactions-table__description">
                    <TransactionCategoryIcon category={transaction.category} />
                    <strong>{transaction.description}</strong>
                  </div>
                </td>
                <td>
                  <time dateTime={transaction.transactionDate}>
                    {formatDate(transaction.transactionDate)}
                  </time>
                </td>
                <td>
                  <Tag tone={transaction.category?.tone ?? 'gray'}>
                    {transaction.category?.name ?? 'Sem categoria'}
                  </Tag>
                </td>
                <td>
                  <TransactionTypeBadge type={transaction.type} />
                </td>
                <td>
                  <strong>{formatTransactionAmount(transaction)}</strong>
                </td>
                <td>
                  <div className="transactions-table__actions">
                    <IconButton
                      label={`Excluir transação ${transaction.description}`}
                      onClick={() => onDelete(transaction)}
                      variant="danger"
                    >
                      <Trash2 aria-hidden="true" />
                    </IconButton>
                    <IconButton
                      label={`Editar transação ${transaction.description}`}
                      onClick={() => onEdit(transaction)}
                    >
                      <Pencil aria-hidden="true" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="transactions-table__footer">
        <p>
          <strong>{firstResult}</strong> a <strong>{lastResult}</strong> |{' '}
          <strong>{totalTransactions}</strong>{' '}
          {totalTransactions === 1 ? 'resultado' : 'resultados'}
        </p>

        <nav className="transactions-pagination" aria-label="Paginação de transações">
          <PaginationButton
            aria-label="Página anterior"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </PaginationButton>
          {visiblePages.map((page) => (
            <PaginationButton
              active={page === currentPage}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Página ${page}`}
              key={page}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationButton>
          ))}
          <PaginationButton
            aria-label="Próxima página"
            disabled={currentPage === pageCount}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </PaginationButton>
        </nav>
      </footer>
    </section>
  )
}

export function TransactionsPage() {
  const [state, setState] = useState<TransactionsState>({ status: 'loading' })
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [modal, setModal] = useState<TransactionModalState>(null)
  const [deleteModal, setDeleteModal] = useState<DeleteTransactionModalState>(null)
  const requestIdRef = useRef(0)

  const loadTransactions = useCallback((showLoading = true) => {
    const token = getAuthToken()

    if (!token) {
      window.location.replace('/erro')
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    if (showLoading) {
      setState({ status: 'loading' })
    }

    getTransactionsData(token)
      .then((data) => {
        if (requestIdRef.current === requestId) {
          setState({ data, status: 'success' })
        }
      })
      .catch((error: unknown) => {
        if (requestIdRef.current === requestId) {
          setState({
            message: getTransactionsErrorMessage(error),
            status: 'error',
          })
        }
      })
  }, [])

  const handleFilterChange = useCallback(
    <TField extends keyof TransactionFilters>(
      field: TField,
      value: TransactionFilters[TField],
    ) => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        [field]: value,
      }))
      setCurrentPage(1)
    },
    [],
  )

  const handleCloseModal = useCallback(() => {
    setModal(null)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal(null)
  }, [])

  const handleSubmitTransaction = useCallback(
    async (values: TransactionFormValues) => {
      const token = getAuthToken()

      if (!token) {
        window.location.replace('/erro')
        return
      }

      const input = getTransactionFormInput(values)

      if (modal?.mode === 'edit') {
        await updateTransaction(token, modal.transaction.id, input)
      } else {
        await createTransaction(token, input)
      }

      setModal(null)
      loadTransactions(false)
    },
    [loadTransactions, modal],
  )

  const handleDeleteTransaction = useCallback(
    async (transaction: TransactionListItem) => {
      const token = getAuthToken()

      if (!token) {
        window.location.replace('/erro')
        return
      }

      await deleteTransaction(token, transaction.id)
      setDeleteModal(null)
      loadTransactions(false)
    },
    [loadTransactions],
  )

  useEffect(() => {
    loadTransactions()

    return () => {
      requestIdRef.current += 1
    }
  }, [loadTransactions])

  const pageData = useMemo(() => {
    if (state.status !== 'success') {
      return null
    }

    const periodOptions = buildPeriodOptions(state.data.transactions)
    const selectedPeriod =
      filters.period && periodOptions.some((option) => option.value === filters.period)
        ? filters.period
        : periodOptions[0]?.value ?? allPeriodsValue
    const categoryOptions = buildCategoryOptions(
      state.data.categories,
      state.data.transactions,
    )
    const filteredTransactions = filterTransactions(
      state.data.transactions,
      filters,
      selectedPeriod,
    )
    const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
    const safeCurrentPage = Math.min(currentPage, pageCount)
    const pageStart = (safeCurrentPage - 1) * pageSize

    return {
      categoryOptions,
      filteredTransactions,
      pageCount,
      paginatedTransactions: filteredTransactions.slice(pageStart, pageStart + pageSize),
      periodOptions,
      safeCurrentPage,
      selectedPeriod,
    }
  }, [currentPage, filters, state])

  useEffect(() => {
    if (!pageData || pageData.safeCurrentPage === currentPage) {
      return
    }

    setCurrentPage(pageData.safeCurrentPage)
  }, [currentPage, pageData])

  if (state.status === 'loading') {
    return <TransactionsLoading />
  }

  if (state.status === 'error') {
    return (
      <>
        <TransactionsError
          message={state.message}
          onCreate={() => setModal({ mode: 'create' })}
          onRetry={() => loadTransactions()}
        />
        {modal ? (
          <TransactionModal
            categories={[]}
            modal={modal}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTransaction}
          />
        ) : null}
      </>
    )
  }

  if (!pageData) {
    return null
  }

  if (state.data.transactions.length === 0) {
    return (
      <>
        <TransactionsEmpty
          categoryOptions={pageData.categoryOptions}
          filters={filters}
          onCreate={() => setModal({ mode: 'create' })}
          onFilterChange={handleFilterChange}
          period={pageData.selectedPeriod}
          periodOptions={pageData.periodOptions}
        />
        {modal ? (
          <TransactionModal
            categories={state.data.categories}
            modal={modal}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTransaction}
          />
        ) : null}
      </>
    )
  }

  return (
    <section className="transactions-page" aria-label="Transações">
      <TransactionsHeader onCreate={() => setModal({ mode: 'create' })} />
      <TransactionsFilters
        categoryOptions={pageData.categoryOptions}
        filters={filters}
        onFilterChange={handleFilterChange}
        period={pageData.selectedPeriod}
        periodOptions={pageData.periodOptions}
      />

      {pageData.filteredTransactions.length === 0 ? (
        <TransactionsFilteredEmpty />
      ) : (
        <TransactionsTable
          currentPage={pageData.safeCurrentPage}
          onDelete={(transaction) => setDeleteModal({ transaction })}
          onEdit={(transaction) => setModal({ mode: 'edit', transaction })}
          onPageChange={setCurrentPage}
          pageCount={pageData.pageCount}
          totalTransactions={pageData.filteredTransactions.length}
          transactions={pageData.paginatedTransactions}
        />
      )}

      {modal ? (
        <TransactionModal
          categories={state.data.categories}
          modal={modal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTransaction}
        />
      ) : null}

      {deleteModal ? (
        <DeleteTransactionModal
          modal={deleteModal}
          onClose={handleCloseDeleteModal}
          onSubmit={handleDeleteTransaction}
        />
      ) : null}
    </section>
  )
}
