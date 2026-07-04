import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AlertCircle,
  BriefcaseBusiness,
  CarFront,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  PiggyBank,
  Plus,
  ReceiptText,
  RefreshCw,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { getDashboardData, getCategoryTone, type DashboardData } from '../graphql/dashboard'
import { getAuthToken } from '../lib/auth-session'
import { cn } from '../lib/class-names'
import { Button, Tag, TextLink, type TagTone } from '../components/ui'
import './dashboard-page.css'

type DashboardState =
  | { status: 'error'; message: string }
  | { status: 'loading' }
  | { data: DashboardData; status: 'success' }

type SummaryCardProps = {
  icon: ReactNode
  title: string
  value: number
}

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

const categoryIconByName: Record<string, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'piggy-bank': PiggyBank,
  'receipt-text': ReceiptText,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
}

const skeletonRows = Array.from({ length: 5 }, (_, index) => index)

function formatCurrency(value: number): string {
  return currencyFormatter.format(value).replace(/\s/g, ' ')
}

function formatTransactionAmount(type: string, amount: number): string {
  return `${type === 'INCOME' ? '+' : '-'} ${formatCurrency(amount)}`
}

function formatItemsLabel(count: number): string {
  return count === 1 ? '1 item' : `${count} itens`
}

function SummaryCard({ icon, title, value }: SummaryCardProps) {
  return (
    <article className="dashboard-summary-card">
      <header className="dashboard-summary-card__header">
        {icon}
        <h2>{title}</h2>
      </header>
      <strong>{formatCurrency(value)}</strong>
    </article>
  )
}

function CategoryIcon({ icon, tone }: { icon: string | null; tone: TagTone }) {
  const Icon = icon ? categoryIconByName[icon] ?? ShoppingCart : ShoppingCart

  return (
    <span className={cn('dashboard-category-icon', `dashboard-category-icon--${tone}`)}>
      <Icon aria-hidden="true" />
    </span>
  )
}

function DashboardSkeletonBlock({ className }: { className?: string }) {
  return <span className={cn('dashboard-skeleton', className)} aria-hidden="true" />
}

function DashboardLoading() {
  return (
    <section className="dashboard-page" aria-busy="true" aria-label="Dashboard">
      <span className="dashboard-sr-only" role="status">
        Carregando dashboard...
      </span>

      <div className="dashboard-summary-grid">
        {skeletonRows.slice(0, 3).map((row) => (
          <article className="dashboard-summary-card" key={row}>
            <header className="dashboard-summary-card__header">
              <DashboardSkeletonBlock className="dashboard-skeleton--icon" />
              <DashboardSkeletonBlock className="dashboard-skeleton--label" />
            </header>
            <DashboardSkeletonBlock className="dashboard-skeleton--value" />
          </article>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <section
          className="dashboard-panel dashboard-panel--transactions"
          aria-label="Transações recentes"
        >
          <header className="dashboard-panel__header">
            <DashboardSkeletonBlock className="dashboard-skeleton--section-title" />
            <DashboardSkeletonBlock className="dashboard-skeleton--link" />
          </header>

          <ol className="dashboard-transactions">
            {skeletonRows.map((row) => (
              <li className="dashboard-transactions__row" key={row}>
                <div className="dashboard-transactions__details">
                  <DashboardSkeletonBlock className="dashboard-skeleton--avatar" />
                  <div className="dashboard-transactions__copy">
                    <DashboardSkeletonBlock className="dashboard-skeleton--transaction-title" />
                    <DashboardSkeletonBlock className="dashboard-skeleton--date" />
                  </div>
                </div>

                <div className="dashboard-transactions__category">
                  <DashboardSkeletonBlock className="dashboard-skeleton--tag" />
                </div>

                <div className="dashboard-transactions__amount">
                  <DashboardSkeletonBlock className="dashboard-skeleton--amount" />
                </div>
              </li>
            ))}
          </ol>

          <footer className="dashboard-panel__footer">
            <DashboardSkeletonBlock className="dashboard-skeleton--footer-link" />
          </footer>
        </section>

        <section
          className="dashboard-panel dashboard-panel--categories"
          aria-label="Categorias"
        >
          <header className="dashboard-panel__header">
            <DashboardSkeletonBlock className="dashboard-skeleton--section-title" />
            <DashboardSkeletonBlock className="dashboard-skeleton--link" />
          </header>

          <ol className="dashboard-categories">
            {skeletonRows.map((row) => (
              <li className="dashboard-categories__row" key={row}>
                <DashboardSkeletonBlock className="dashboard-skeleton--tag" />
                <DashboardSkeletonBlock className="dashboard-skeleton--items" />
                <DashboardSkeletonBlock className="dashboard-skeleton--category-value" />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  )
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <section className="dashboard-page" aria-label="Dashboard">
      <div className="dashboard-state-card dashboard-state-card--error" role="alert">
        <span className="dashboard-state-card__icon">
          <AlertCircle aria-hidden="true" />
        </span>
        <div className="dashboard-state-card__copy">
          <strong>Erro ao carregar dashboard</strong>
          <span>{message}</span>
        </div>
        <Button icon={<RefreshCw aria-hidden="true" />} onClick={onRetry} size="sm">
          Tentar novamente
        </Button>
      </div>
    </section>
  )
}

function DashboardEmpty({
  compact = false,
  description,
  title,
}: {
  compact?: boolean
  description: string
  title: string
}) {
  return (
    <div className={cn('dashboard-empty', compact && 'dashboard-empty--compact')}>
      <span className="dashboard-empty__icon">
        <ReceiptText aria-hidden="true" />
      </span>
      <div className="dashboard-empty__copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  )
}

function getDashboardErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Tente novamente mais tarde.'
}

function getEmptyBalance(): DashboardData['balance'] {
  return {
    expense: 0,
    income: 0,
    total: 0,
  }
}

function isDashboardEmpty(data: DashboardData): boolean {
  return data.recentTransactions.length === 0 && data.topCategories.length === 0
}

function DashboardSummaryGrid({ data }: { data?: DashboardData }) {
  const balance = data?.balance ?? getEmptyBalance()

  return (
    <div className="dashboard-summary-grid">
      <SummaryCard
        icon={<Wallet aria-hidden="true" className="dashboard-summary-card__icon--wallet" />}
        title="Saldo total"
        value={balance.total}
      />
      <SummaryCard
        icon={
          <CircleArrowUp
            aria-hidden="true"
            className="dashboard-summary-card__icon--income"
          />
        }
        title="Receitas do mês"
        value={balance.income}
      />
      <SummaryCard
        icon={
          <CircleArrowDown
            aria-hidden="true"
            className="dashboard-summary-card__icon--expense"
          />
        }
        title="Despesas do mês"
        value={balance.expense}
      />
    </div>
  )
}

function DashboardEmptyOverview() {
  return (
    <section className="dashboard-page" aria-label="Dashboard">
      <DashboardSummaryGrid />

      <div className="dashboard-main-grid">
        <section
          className="dashboard-panel dashboard-panel--transactions"
          aria-labelledby="dashboard-transactions-title"
        >
          <header className="dashboard-panel__header">
            <h2 id="dashboard-transactions-title">Transações recentes</h2>
            <TextLink href="/transacoes" rightIcon={<ChevronRight aria-hidden="true" />}>
              Ver todas
            </TextLink>
          </header>

          <DashboardEmpty
            description="Quando você criar uma entrada ou saída, ela aparece neste resumo."
            title="Nenhuma transação cadastrada"
          />

          <footer className="dashboard-panel__footer">
            <TextLink href="/transacoes" leftIcon={<Plus aria-hidden="true" />}>
              Nova transação
            </TextLink>
          </footer>
        </section>

        <section
          className="dashboard-panel dashboard-panel--categories"
          aria-labelledby="dashboard-categories-title"
        >
          <header className="dashboard-panel__header">
            <h2 id="dashboard-categories-title">Categorias</h2>
            <TextLink href="/categorias" rightIcon={<ChevronRight aria-hidden="true" />}>
              Gerenciar
            </TextLink>
          </header>

          <DashboardEmpty
            compact
            description="As categorias aparecem aqui quando houver despesas no mês."
            title="Sem categorias no resumo"
          />
        </section>
      </div>
    </section>
  )
}

export function DashboardPage() {
  const [state, setState] = useState<DashboardState>({ status: 'loading' })
  const requestIdRef = useRef(0)

  const loadDashboard = useCallback(() => {
    const token = getAuthToken()

    if (!token) {
      window.location.replace('/erro')
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setState({ status: 'loading' })

    getDashboardData(token)
      .then((data) => {
        if (requestIdRef.current === requestId) {
          setState({ data, status: 'success' })
        }
      })
      .catch((error: unknown) => {
        if (requestIdRef.current === requestId) {
          setState({
            message: getDashboardErrorMessage(error),
            status: 'error',
          })
        }
      })
  }, [])

  useEffect(() => {
    loadDashboard()
    return () => {
      requestIdRef.current += 1
    }
  }, [loadDashboard])

  if (state.status === 'loading') {
    return <DashboardLoading />
  }

  if (state.status === 'error') {
    return <DashboardError message={state.message} onRetry={loadDashboard} />
  }

  const { data } = state

  if (isDashboardEmpty(data)) {
    return <DashboardEmptyOverview />
  }

  return (
    <section className="dashboard-page" aria-label="Dashboard">
      <DashboardSummaryGrid data={data} />

      <div className="dashboard-main-grid">
        <section
          className="dashboard-panel dashboard-panel--transactions"
          aria-labelledby="dashboard-transactions-title"
        >
          <header className="dashboard-panel__header">
            <h2 id="dashboard-transactions-title">Transações recentes</h2>
            <TextLink href="/transacoes" rightIcon={<ChevronRight aria-hidden="true" />}>
              Ver todas
            </TextLink>
          </header>

          {data.recentTransactions.length > 0 ? (
            <ol className="dashboard-transactions">
              {data.recentTransactions.map((transaction) => {
                const category = transaction.category
                const tone = getCategoryTone(category?.color)

                return (
                  <li className="dashboard-transactions__row" key={transaction.id}>
                    <div className="dashboard-transactions__details">
                      <CategoryIcon icon={category?.icon ?? null} tone={tone} />
                      <div className="dashboard-transactions__copy">
                        <strong>{transaction.description}</strong>
                        <time dateTime={transaction.transactionDate}>
                          {dateFormatter.format(new Date(transaction.transactionDate))}
                        </time>
                      </div>
                    </div>

                    <div className="dashboard-transactions__category">
                      <Tag tone={tone}>{category?.name ?? 'Sem categoria'}</Tag>
                    </div>

                    <div className="dashboard-transactions__amount">
                      <strong>{formatTransactionAmount(transaction.type, transaction.amount)}</strong>
                      {transaction.type === 'INCOME' ? (
                        <CircleArrowUp
                          aria-hidden="true"
                          className="dashboard-transactions__amount-icon dashboard-transactions__amount-icon--income"
                        />
                      ) : (
                        <CircleArrowDown
                          aria-hidden="true"
                          className="dashboard-transactions__amount-icon dashboard-transactions__amount-icon--expense"
                        />
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          ) : (
            <DashboardEmpty
              description="Quando você criar uma entrada ou saída, ela aparece neste resumo."
              title="Nenhuma transação cadastrada"
            />
          )}

          <footer className="dashboard-panel__footer">
            <TextLink href="/transacoes" leftIcon={<Plus aria-hidden="true" />}>
              Nova transação
            </TextLink>
          </footer>
        </section>

        <section
          className="dashboard-panel dashboard-panel--categories"
          aria-labelledby="dashboard-categories-title"
        >
          <header className="dashboard-panel__header">
            <h2 id="dashboard-categories-title">Categorias</h2>
            <TextLink href="/categorias" rightIcon={<ChevronRight aria-hidden="true" />}>
              Gerenciar
            </TextLink>
          </header>

          {data.topCategories.length > 0 ? (
            <ol className="dashboard-categories">
              {data.topCategories.map((stat) => (
                <li className="dashboard-categories__row" key={stat.category.id}>
                  <Tag tone={stat.tone}>{stat.category.name}</Tag>
                  <span className="dashboard-categories__count">
                    {formatItemsLabel(stat.transactionCount)}
                  </span>
                  <strong>{formatCurrency(stat.totalAmount)}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <DashboardEmpty
              compact
              description="As categorias aparecem aqui quando houver despesas no mês."
              title="Sem categorias no resumo"
            />
          )}
        </section>
      </div>
    </section>
  )
}
