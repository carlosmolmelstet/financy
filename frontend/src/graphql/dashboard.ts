import { requestGraphQL } from '../lib/graphql-client'
import type { TagTone } from '../components/ui'

export type DashboardCategory = {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  createdAt: string
  updatedAt: string
}

export type DashboardTransactionType = 'INCOME' | 'EXPENSE'

export type DashboardTransaction = {
  id: string
  description: string
  amount: number
  type: DashboardTransactionType
  transactionDate: string
  categoryId: string | null
  createdAt: string
  updatedAt: string
  category: DashboardCategory | null
}

export type DashboardCategoryStat = {
  category: DashboardCategory
  tone: TagTone
  totalAmount: number
  transactionCount: number
}

export type DashboardData = {
  balance: {
    expense: number
    income: number
    total: number
  }
  recentTransactions: DashboardTransaction[]
  topCategories: DashboardCategoryStat[]
}

type DashboardQueryData = {
  categories: DashboardCategory[]
  transactions: Array<Omit<DashboardTransaction, 'category'>>
}

const dashboardQuery = `#graphql
  query Dashboard {
    categories {
      id
      name
      description
      color
      icon
      createdAt
      updatedAt
    }
    transactions {
      id
      description
      amount
      type
      transactionDate
      categoryId
      createdAt
      updatedAt
    }
  }
`

const toneByColor: Record<string, TagTone> = {
  '#16A34A': 'green',
  '#1F6F43': 'green',
  '#22C55E': 'green',
  '#2563EB': 'blue',
  '#3B82F6': 'blue',
  '#9333EA': 'purple',
  '#A855F7': 'purple',
  '#DB2777': 'pink',
  '#E11D48': 'pink',
  '#DC2626': 'red',
  '#EF4444': 'red',
  '#EA580C': 'orange',
  '#F97316': 'orange',
  '#CA8A04': 'yellow',
  '#EAB308': 'yellow',
}

const toneNames = new Set<TagTone>([
  'blue',
  'green',
  'gray',
  'orange',
  'pink',
  'purple',
  'red',
  'yellow',
])

export function getCategoryTone(color: string | null | undefined): TagTone {
  const normalizedColor = color?.trim()

  if (!normalizedColor) {
    return 'gray'
  }

  const lowerColor = normalizedColor.toLowerCase()

  if (toneNames.has(lowerColor as TagTone)) {
    return lowerColor as TagTone
  }

  return toneByColor[normalizedColor.toUpperCase()] ?? 'gray'
}

function isCurrentMonth(isoDate: string): boolean {
  const date = new Date(isoDate)
  const now = new Date()

  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

function buildDashboardData(data: DashboardQueryData): DashboardData {
  const categoriesById = new Map(data.categories.map((category) => [category.id, category]))

  const transactions = data.transactions
    .map((transaction) => ({
      ...transaction,
      category: transaction.categoryId
        ? categoriesById.get(transaction.categoryId) ?? null
        : null,
    }))
    .sort(
      (first, second) =>
        Date.parse(second.transactionDate) - Date.parse(first.transactionDate),
    )

  const balance = transactions.reduce(
    (totals, transaction) => {
      const signedAmount =
        transaction.type === 'INCOME' ? transaction.amount : -transaction.amount

      totals.total += signedAmount

      if (isCurrentMonth(transaction.transactionDate)) {
        if (transaction.type === 'INCOME') {
          totals.income += transaction.amount
        } else {
          totals.expense += transaction.amount
        }
      }

      return totals
    },
    { expense: 0, income: 0, total: 0 },
  )

  const categoryStats = new Map<string, DashboardCategoryStat>()

  for (const transaction of transactions) {
    if (transaction.type !== 'EXPENSE' || !isCurrentMonth(transaction.transactionDate)) {
      continue
    }

    const category = transaction.category

    if (!category) {
      continue
    }

    const currentStat =
      categoryStats.get(category.id) ??
      ({
        category,
        tone: getCategoryTone(category.color),
        totalAmount: 0,
        transactionCount: 0,
      } satisfies DashboardCategoryStat)

    currentStat.totalAmount += transaction.amount
    currentStat.transactionCount += 1
    categoryStats.set(category.id, currentStat)
  }

  return {
    balance,
    recentTransactions: transactions.slice(0, 5),
    topCategories: [...categoryStats.values()]
      .sort((first, second) => second.totalAmount - first.totalAmount)
      .slice(0, 5),
  }
}

export async function getDashboardData(token: string): Promise<DashboardData> {
  const data = await requestGraphQL<DashboardQueryData>(dashboardQuery, { token })

  return buildDashboardData(data)
}
