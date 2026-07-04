import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  AlertCircle,
  ArrowUpDown,
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
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
  createCategory,
  deleteCategory,
  getCategoriesData,
  updateCategory,
  type CategoriesData,
  type CategoryFormInput,
  type CategoryWithStats,
} from '../graphql/categories'
import { getAuthToken } from '../lib/auth-session'
import { cn } from '../lib/class-names'
import { Button, IconButton, Input, Tag, type TagTone } from '../components/ui'
import './categories-page.css'

type CategoriesState =
  | { status: 'error'; message: string }
  | { status: 'loading' }
  | { data: CategoriesData; status: 'success' }

type SummaryCardProps = {
  icon: ReactNode
  label: string
  value: string | number
}

type CategoryModalState =
  | { mode: 'create' }
  | { category: CategoryWithStats; mode: 'edit' }
  | null

type DeleteCategoryModalState = {
  category: CategoryWithStats
} | null

type CategoryFormValues = {
  color: string
  description: string
  icon: string
  name: string
}

type CategoryFormErrors = Partial<Record<keyof CategoryFormValues | 'form', string>>

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

const categoryIconOptions: Array<{ icon: LucideIcon; label: string; value: string }> = [
  { icon: BriefcaseBusiness, label: 'Negócios', value: 'briefcase-business' },
  { icon: CarFront, label: 'Transporte', value: 'car-front' },
  { icon: HeartPulse, label: 'Saúde', value: 'heart-pulse' },
  { icon: PiggyBank, label: 'Investimentos', value: 'piggy-bank' },
  { icon: ShoppingCart, label: 'Mercado', value: 'shopping-cart' },
  { icon: Ticket, label: 'Entretenimento', value: 'ticket' },
  { icon: ToolCase, label: 'Utilidades', value: 'tool-case' },
  { icon: Utensils, label: 'Alimentação', value: 'utensils' },
  { icon: TagIcon, label: 'Categoria', value: 'tag' },
  { icon: House, label: 'Casa', value: 'house' },
  { icon: Gift, label: 'Presentes', value: 'gift' },
  { icon: Dumbbell, label: 'Academia', value: 'dumbbell' },
  { icon: BookOpen, label: 'Educação', value: 'book-open' },
  { icon: BaggageClaim, label: 'Viagem', value: 'baggage-claim' },
  { icon: Mailbox, label: 'Correspondência', value: 'mailbox' },
  { icon: ReceiptText, label: 'Contas', value: 'receipt-text' },
]

const categoryColorOptions: Array<{ label: string; value: string }> = [
  { label: 'Verde', value: '#16A34A' },
  { label: 'Azul', value: '#2563EB' },
  { label: 'Roxo', value: '#9333EA' },
  { label: 'Rosa', value: '#DB2777' },
  { label: 'Vermelho', value: '#DC2626' },
  { label: 'Laranja', value: '#EA580C' },
  { label: 'Amarelo', value: '#CA8A04' },
]

const defaultCategoryFormValues: CategoryFormValues = {
  color: categoryColorOptions[0]?.value ?? '#16A34A',
  description: '',
  icon: categoryIconOptions[0]?.value ?? 'briefcase-business',
  name: '',
}

const fallbackColorByTone: Record<TagTone, string> = {
  blue: '#2563EB',
  gray: '#16A34A',
  green: '#16A34A',
  orange: '#EA580C',
  pink: '#DB2777',
  purple: '#9333EA',
  red: '#DC2626',
  yellow: '#CA8A04',
}

const skeletonItems = Array.from({ length: 8 }, (_, index) => index)

function formatItemsLabel(count: number): string {
  return count === 1 ? '1 item' : `${count} itens`
}

function formatLinkedItemsLabel(count: number): string {
  return count === 1 ? '1 item vinculado' : `${count} itens vinculados`
}

function formatUncategorizedItemsLabel(count: number): string {
  return count === 1 ? '1 item sem categoria' : `${count} itens sem categoria`
}

function getCategoryDescription(category: CategoryWithStats): string {
  return category.description?.trim() || 'Sem descrição cadastrada'
}

function getCategoriesErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Tente novamente mais tarde.'
}

function getCategoryMutationErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Não foi possível salvar a categoria.'
  }

  if (error.message === 'A category with this name already exists') {
    return 'Já existe uma categoria com esse título.'
  }

  if (error.message === 'Category name must have at least 2 characters') {
    return 'O título deve ter pelo menos 2 caracteres.'
  }

  if (error.message === 'Category name must have at most 80 characters') {
    return 'O título deve ter no máximo 80 caracteres.'
  }

  if (error.message === 'Category description must have at most 240 characters') {
    return 'A descrição deve ter no máximo 240 caracteres.'
  }

  return error.message || 'Não foi possível salvar a categoria.'
}

function getCategoryDeleteErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Não foi possível excluir a categoria.'
  }

  if (error.message === 'Category not found') {
    return 'Categoria não encontrada.'
  }

  return error.message || 'Não foi possível excluir a categoria.'
}

function getFormValuesFromModal(modal: CategoryModalState): CategoryFormValues {
  if (!modal || modal.mode === 'create') {
    return defaultCategoryFormValues
  }

  const categoryIcon = categoryIconOptions.some(
    (option) => option.value === modal.category.icon,
  )
    ? modal.category.icon
    : defaultCategoryFormValues.icon
  const categoryColor = categoryColorOptions.some(
    (option) => option.value === modal.category.color,
  )
    ? modal.category.color
    : fallbackColorByTone[modal.category.tone]

  return {
    color: categoryColor ?? defaultCategoryFormValues.color,
    description: modal.category.description ?? '',
    icon: categoryIcon ?? defaultCategoryFormValues.icon,
    name: modal.category.name,
  }
}

function getCategoryFormInput(values: CategoryFormValues): CategoryFormInput {
  const trimmedDescription = values.description.trim()

  return {
    color: values.color,
    description: trimmedDescription.length > 0 ? trimmedDescription : null,
    icon: values.icon,
    name: values.name.trim(),
  }
}

function validateCategoryForm(values: CategoryFormValues): CategoryFormErrors {
  const errors: CategoryFormErrors = {}
  const trimmedName = values.name.trim()

  if (!trimmedName) {
    errors.name = 'Informe o título da categoria.'
  } else if (trimmedName.length < 2) {
    errors.name = 'O título deve ter pelo menos 2 caracteres.'
  } else if (trimmedName.length > 80) {
    errors.name = 'O título deve ter no máximo 80 caracteres.'
  }

  if (values.description.trim().length > 240) {
    errors.description = 'A descrição deve ter no máximo 240 caracteres.'
  }

  if (!categoryIconOptions.some((option) => option.value === values.icon)) {
    errors.icon = 'Selecione um ícone.'
  }

  if (!categoryColorOptions.some((option) => option.value === values.color)) {
    errors.color = 'Selecione uma cor.'
  }

  return errors
}

function hasCategoryFormErrors(errors: CategoryFormErrors): boolean {
  return Object.values(errors).some(Boolean)
}

function CategoryIcon({
  icon,
  tone,
  variant = 'card',
}: {
  icon: string | null
  tone: TagTone
  variant?: 'card' | 'summary'
}) {
  const Icon = icon ? categoryIconByName[icon] ?? TagIcon : TagIcon

  return (
    <span
      className={cn(
        'categories-category-icon',
        `categories-category-icon--${tone}`,
        `categories-category-icon--${variant}`,
      )}
    >
      <Icon aria-hidden="true" />
    </span>
  )
}

function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <article className="categories-summary-card">
      <div className="categories-summary-card__icon">{icon}</div>
      <div className="categories-summary-card__copy">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  )
}

function CategoriesHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="categories-page__header">
      <div className="categories-page__heading">
        <h1>Categorias</h1>
        <p>Organize suas transações por categorias</p>
      </div>

      <Button icon={<Plus aria-hidden="true" />} onClick={onCreate} size="sm">
        Nova categoria
      </Button>
    </header>
  )
}

function CategoriesSummary({ data }: { data: CategoriesData }) {
  return (
    <section className="categories-summary-grid" aria-label="Resumo de categorias">
      <SummaryCard
        icon={<TagIcon aria-hidden="true" />}
        label="total de categorias"
        value={data.totalCategories}
      />
      <SummaryCard
        icon={<ArrowUpDown aria-hidden="true" />}
        label="total de transações"
        value={data.totalTransactions}
      />
      <SummaryCard
        icon={
          data.mostUsedCategory ? (
            <CategoryIcon
              icon={data.mostUsedCategory.icon}
              tone={data.mostUsedCategory.tone}
              variant="summary"
            />
          ) : (
            <TagIcon aria-hidden="true" />
          )
        }
        label="categoria mais utilizada"
        value={data.mostUsedCategory?.name ?? 'Nenhuma'}
      />
    </section>
  )
}

function CategoryCard({
  category,
  onDelete,
  onEdit,
}: {
  category: CategoryWithStats
  onDelete: (category: CategoryWithStats) => void
  onEdit: (category: CategoryWithStats) => void
}) {
  return (
    <article className="categories-card">
      <header className="categories-card__header">
        <CategoryIcon icon={category.icon} tone={category.tone} />

        <div className="categories-card__actions">
          <IconButton
            label={`Excluir categoria ${category.name}`}
            onClick={() => onDelete(category)}
            variant="danger"
          >
            <Trash2 aria-hidden="true" />
          </IconButton>
          <IconButton
            label={`Editar categoria ${category.name}`}
            onClick={() => onEdit(category)}
          >
            <Pencil aria-hidden="true" />
          </IconButton>
        </div>
      </header>

      <div className="categories-card__body">
        <h2>{category.name}</h2>
        <p>{getCategoryDescription(category)}</p>
      </div>

      <footer className="categories-card__footer">
        <Tag tone={category.tone}>{category.name}</Tag>
        <span>{formatItemsLabel(category.transactionCount)}</span>
      </footer>
    </article>
  )
}

function DeleteCategoryModal({
  modal,
  onClose,
  onSubmit,
}: {
  modal: Exclude<DeleteCategoryModalState, null>
  onClose: () => void
  onSubmit: (category: CategoryWithStats, deleteTransactions: boolean) => Promise<void>
}) {
  const [deleteTransactions, setDeleteTransactions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasLinkedTransactions = modal.category.transactionCount > 0
  const linkedTransactionsText = formatLinkedItemsLabel(modal.category.transactionCount)
  const uncategorizedTransactionsText = formatUncategorizedItemsLabel(
    modal.category.transactionCount,
  )

  useEffect(() => {
    setDeleteTransactions(false)
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
      await onSubmit(modal.category, hasLinkedTransactions && deleteTransactions)
    } catch (submitError) {
      setError(getCategoryDeleteErrorMessage(submitError))
      setIsSubmitting(false)
    }
  }

  return (
    <div
      aria-labelledby="category-delete-modal-title"
      aria-modal="true"
      className="categories-modal-overlay"
      role="dialog"
    >
      <form
        className="categories-modal categories-delete-modal"
        noValidate
        onSubmit={handleSubmit}
      >
        <header className="categories-modal__header">
          <div className="categories-modal__heading">
            <h2 id="category-delete-modal-title">Excluir categoria?</h2>
            <p>Essa ação não poderá ser desfeita.</p>
          </div>

          <IconButton disabled={isSubmitting} label="Fechar modal" onClick={onClose}>
            <X aria-hidden="true" />
          </IconButton>
        </header>

        <div className="categories-delete-modal__body">
          <span className="categories-delete-modal__icon">
            <Trash2 aria-hidden="true" />
          </span>

          <div className="categories-delete-modal__copy">
            <strong>{modal.category.name}</strong>
            {hasLinkedTransactions ? (
              <span>{linkedTransactionsText}. Escolha uma ação.</span>
            ) : (
              <span>Esta categoria não possui transações vinculadas.</span>
            )}
          </div>
        </div>

        {hasLinkedTransactions ? (
          <fieldset className="categories-delete-modal__options">
            <legend>O que fazer com as transações?</legend>

            <label className="categories-delete-modal__option">
              <input
                checked={!deleteTransactions}
                disabled={isSubmitting}
                name="delete-category-mode"
                onChange={() => setDeleteTransactions(false)}
                type="radio"
                value="keep-transactions"
              />
              <span>
                <strong>Manter transações</strong>
                <small>Remove a categoria e deixa {uncategorizedTransactionsText}.</small>
              </span>
            </label>

            <label className="categories-delete-modal__option">
              <input
                checked={deleteTransactions}
                disabled={isSubmitting}
                name="delete-category-mode"
                onChange={() => setDeleteTransactions(true)}
                type="radio"
                value="delete-transactions"
              />
              <span>
                <strong>Excluir tudo</strong>
                <small>Remove a categoria e exclui {linkedTransactionsText}.</small>
              </span>
            </label>
          </fieldset>
        ) : null}

        {error ? (
          <p className="categories-modal__alert" role="alert">
            {error}
          </p>
        ) : null}

        <div className="categories-delete-modal__actions">
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="outline">
            Cancelar
          </Button>
          <Button
            className="categories-delete-modal__confirm"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Excluindo...' : 'Excluir categoria'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function CategoryModal({
  modal,
  onClose,
  onSubmit,
}: {
  modal: Exclude<CategoryModalState, null>
  onClose: () => void
  onSubmit: (values: CategoryFormValues) => Promise<void>
}) {
  const [values, setValues] = useState<CategoryFormValues>(() =>
    getFormValuesFromModal(modal),
  )
  const [errors, setErrors] = useState<CategoryFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const title = modal.mode === 'create' ? 'Nova categoria' : 'Editar categoria'

  useEffect(() => {
    setValues(getFormValuesFromModal(modal))
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

  function updateField<TField extends keyof CategoryFormValues>(
    field: TField,
    value: CategoryFormValues[TField],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateCategoryForm(values)
    setErrors(nextErrors)

    if (hasCategoryFormErrors(nextErrors)) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(values)
    } catch (error) {
      setErrors({
        form: getCategoryMutationErrorMessage(error),
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div
      aria-labelledby="category-modal-title"
      aria-modal="true"
      className="categories-modal-overlay"
      role="dialog"
    >
      <form className="categories-modal" noValidate onSubmit={handleSubmit}>
        <header className="categories-modal__header">
          <div className="categories-modal__heading">
            <h2 id="category-modal-title">{title}</h2>
            <p>Organize suas transações com categorias</p>
          </div>

          <IconButton disabled={isSubmitting} label="Fechar modal" onClick={onClose}>
            <X aria-hidden="true" />
          </IconButton>
        </header>

        <div className="categories-modal__form">
          <Input
            autoComplete="off"
            disabled={isSubmitting}
            error={errors.name}
            label="Título"
            name="category-title"
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Ex. Alimentação"
            value={values.name}
          />

          <Input
            autoComplete="off"
            disabled={isSubmitting}
            error={errors.description}
            helperText="Opcional"
            label="Descrição"
            name="category-description"
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Descrição da categoria"
            value={values.description}
          />

          <fieldset className="categories-modal-choice">
            <legend>Ícone</legend>
            <div className="categories-modal-icon-grid">
              {categoryIconOptions.map((option) => {
                const Icon = option.icon

                return (
                  <button
                    aria-label={option.label}
                    aria-pressed={values.icon === option.value}
                    className={cn(
                      'categories-modal-icon-option',
                      values.icon === option.value &&
                        'categories-modal-icon-option--selected',
                    )}
                    disabled={isSubmitting}
                    key={option.value}
                    onClick={() => updateField('icon', option.value)}
                    title={option.label}
                    type="button"
                  >
                    <Icon aria-hidden="true" />
                  </button>
                )
              })}
            </div>
            {errors.icon ? (
              <span className="categories-modal-choice__error">{errors.icon}</span>
            ) : null}
          </fieldset>

          <fieldset className="categories-modal-choice">
            <legend>Cor</legend>
            <div className="categories-modal-color-grid">
              {categoryColorOptions.map((option) => (
                <button
                  aria-label={option.label}
                  aria-pressed={values.color === option.value}
                  className={cn(
                    'categories-modal-color-option',
                    values.color === option.value &&
                      'categories-modal-color-option--selected',
                  )}
                  disabled={isSubmitting}
                  key={option.value}
                  onClick={() => updateField('color', option.value)}
                  title={option.label}
                  type="button"
                >
                  <span style={{ backgroundColor: option.value }} />
                </button>
              ))}
            </div>
            {errors.color ? (
              <span className="categories-modal-choice__error">{errors.color}</span>
            ) : null}
          </fieldset>
        </div>

        {errors.form ? (
          <p className="categories-modal__alert" role="alert">
            {errors.form}
          </p>
        ) : null}

        <Button className="categories-modal__submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  )
}

function CategoriesSkeletonBlock({ className }: { className?: string }) {
  return <span className={cn('categories-skeleton', className)} aria-hidden="true" />
}

function CategoriesLoading() {
  return (
    <section className="categories-page" aria-busy="true" aria-label="Categorias">
      <span className="categories-sr-only" role="status">
        Carregando categorias...
      </span>

      <CategoriesHeader onCreate={() => undefined} />

      <section className="categories-summary-grid" aria-label="Resumo de categorias">
        {skeletonItems.slice(0, 3).map((item) => (
          <article className="categories-summary-card" key={item}>
            <CategoriesSkeletonBlock className="categories-skeleton--summary-icon" />
            <div className="categories-summary-card__copy">
              <CategoriesSkeletonBlock className="categories-skeleton--summary-value" />
              <CategoriesSkeletonBlock className="categories-skeleton--summary-label" />
            </div>
          </article>
        ))}
      </section>

      <div className="categories-grid">
        {skeletonItems.map((item) => (
          <article className="categories-card" key={item}>
            <header className="categories-card__header">
              <CategoriesSkeletonBlock className="categories-skeleton--card-icon" />
              <div className="categories-card__actions">
                <CategoriesSkeletonBlock className="categories-skeleton--action" />
                <CategoriesSkeletonBlock className="categories-skeleton--action" />
              </div>
            </header>

            <div className="categories-card__body">
              <CategoriesSkeletonBlock className="categories-skeleton--title" />
              <CategoriesSkeletonBlock className="categories-skeleton--description" />
              <CategoriesSkeletonBlock className="categories-skeleton--description-short" />
            </div>

            <footer className="categories-card__footer">
              <CategoriesSkeletonBlock className="categories-skeleton--tag" />
              <CategoriesSkeletonBlock className="categories-skeleton--items" />
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}

function CategoriesError({
  message,
  onCreate,
  onRetry,
}: {
  message: string
  onCreate: () => void
  onRetry: () => void
}) {
  return (
    <section className="categories-page" aria-label="Categorias">
      <CategoriesHeader onCreate={onCreate} />

      <div className="categories-state-card categories-state-card--error" role="alert">
        <span className="categories-state-card__icon">
          <AlertCircle aria-hidden="true" />
        </span>
        <div className="categories-state-card__copy">
          <strong>Erro ao carregar categorias</strong>
          <span>{message}</span>
        </div>
        <Button icon={<RefreshCw aria-hidden="true" />} onClick={onRetry} size="sm">
          Tentar novamente
        </Button>
      </div>
    </section>
  )
}

function CategoriesEmpty({
  data,
  onCreate,
}: {
  data: CategoriesData
  onCreate: () => void
}) {
  return (
    <section className="categories-page" aria-label="Categorias">
      <CategoriesHeader onCreate={onCreate} />
      <CategoriesSummary data={data} />

      <div className="categories-state-card">
        <span className="categories-state-card__icon">
          <TagIcon aria-hidden="true" />
        </span>
        <div className="categories-state-card__copy">
          <strong>Nenhuma categoria cadastrada</strong>
          <span>Crie uma categoria para organizar suas transações.</span>
        </div>
      </div>
    </section>
  )
}

export function CategoriesPage() {
  const [state, setState] = useState<CategoriesState>({ status: 'loading' })
  const [modal, setModal] = useState<CategoryModalState>(null)
  const [deleteModal, setDeleteModal] = useState<DeleteCategoryModalState>(null)
  const requestIdRef = useRef(0)

  const loadCategories = useCallback((showLoading = true) => {
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

    getCategoriesData(token)
      .then((data) => {
        if (requestIdRef.current === requestId) {
          setState({ data, status: 'success' })
        }
      })
      .catch((error: unknown) => {
        if (requestIdRef.current === requestId) {
          setState({
            message: getCategoriesErrorMessage(error),
            status: 'error',
          })
        }
      })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal(null)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal(null)
  }, [])

  const handleSubmitCategory = useCallback(
    async (values: CategoryFormValues) => {
      const token = getAuthToken()

      if (!token) {
        window.location.replace('/erro')
        return
      }

      const input = getCategoryFormInput(values)

      if (modal?.mode === 'edit') {
        await updateCategory(token, modal.category.id, input)
      } else {
        await createCategory(token, input)
      }

      setModal(null)
      loadCategories(false)
    },
    [loadCategories, modal],
  )

  const handleDeleteCategory = useCallback(
    async (category: CategoryWithStats, deleteLinkedTransactions: boolean) => {
      const token = getAuthToken()

      if (!token) {
        window.location.replace('/erro')
        return
      }

      await deleteCategory(token, category.id, deleteLinkedTransactions)
      setDeleteModal(null)
      loadCategories(false)
    },
    [loadCategories],
  )

  useEffect(() => {
    loadCategories()
    return () => {
      requestIdRef.current += 1
    }
  }, [loadCategories])

  if (state.status === 'loading') {
    return <CategoriesLoading />
  }

  if (state.status === 'error') {
    return (
      <CategoriesError
        message={state.message}
        onCreate={() => setModal({ mode: 'create' })}
        onRetry={() => loadCategories()}
      />
    )
  }

  if (state.data.categories.length === 0) {
    return (
      <>
        <CategoriesEmpty data={state.data} onCreate={() => setModal({ mode: 'create' })} />
        {modal ? (
          <CategoryModal
            modal={modal}
            onClose={handleCloseModal}
            onSubmit={handleSubmitCategory}
          />
        ) : null}
        {deleteModal ? (
          <DeleteCategoryModal
            modal={deleteModal}
            onClose={handleCloseDeleteModal}
            onSubmit={handleDeleteCategory}
          />
        ) : null}
      </>
    )
  }

  return (
    <section className="categories-page" aria-label="Categorias">
      <CategoriesHeader onCreate={() => setModal({ mode: 'create' })} />
      <CategoriesSummary data={state.data} />

      <div className="categories-grid">
        {state.data.categories.map((category) => (
          <CategoryCard
            category={category}
            key={category.id}
            onDelete={(selectedCategory) => setDeleteModal({ category: selectedCategory })}
            onEdit={(selectedCategory) =>
              setModal({ category: selectedCategory, mode: 'edit' })
            }
          />
        ))}
      </div>

      {modal ? (
        <CategoryModal
          modal={modal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitCategory}
        />
      ) : null}
      {deleteModal ? (
        <DeleteCategoryModal
          modal={deleteModal}
          onClose={handleCloseDeleteModal}
          onSubmit={handleDeleteCategory}
        />
      ) : null}
    </section>
  )
}
