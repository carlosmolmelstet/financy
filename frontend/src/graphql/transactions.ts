import type { TagTone } from '../components/ui'
import { requestGraphQL } from '../lib/graphql-client'

export type TransactionType = 'EXPENSE' | 'INCOME'

export type TransactionCategory = {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  createdAt: string
  updatedAt: string
  tone: TagTone
}

export type TransactionListItem = {
  id: string
  description: string
  amount: number
  type: TransactionType
  transactionDate: string
  categoryId: string | null
  createdAt: string
  updatedAt: string
  category: TransactionCategory | null
}

export type TransactionsData = {
  categories: TransactionCategory[]
  transactions: TransactionListItem[]
}

export type TransactionFormInput = {
  amount: number
  categoryId: string | null
  description: string
  transactionDate: string
  type: TransactionType
}

type CategoryQueryItem = Omit<TransactionCategory, 'tone'>

type TransactionQueryItem = Omit<TransactionListItem, 'category'>

type TransactionsQueryData = {
  categories: CategoryQueryItem[]
  transactions: TransactionQueryItem[]
}

const transactionsQuery = `#graphql
  query TransactionsPage {
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

const transactionFields = `
  id
  description
  amount
  type
  transactionDate
  categoryId
  createdAt
  updatedAt
`

const createTransactionMutation = `#graphql
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ${transactionFields}
    }
  }
`

const updateTransactionMutation = `#graphql
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ${transactionFields}
    }
  }
`

const deleteTransactionMutation = `#graphql
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      ${transactionFields}
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

export function getTransactionCategoryTone(color: string | null | undefined): TagTone {
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

function buildTransactionsData(data: TransactionsQueryData): TransactionsData {
  const categories = data.categories
    .map((category) => ({
      ...category,
      tone: getTransactionCategoryTone(category.color),
    }))
    .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'))

  const categoriesById = new Map(categories.map((category) => [category.id, category]))

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

  return {
    categories,
    transactions,
  }
}

export async function getTransactionsData(token: string): Promise<TransactionsData> {
  const data = await requestGraphQL<TransactionsQueryData>(transactionsQuery, { token })

  return buildTransactionsData(data)
}

export async function createTransaction(
  token: string,
  input: TransactionFormInput,
): Promise<TransactionQueryItem> {
  const data = await requestGraphQL<{ createTransaction: TransactionQueryItem }>(
    createTransactionMutation,
    {
      token,
      variables: { input },
    },
  )

  return data.createTransaction
}

export async function updateTransaction(
  token: string,
  id: string,
  input: TransactionFormInput,
): Promise<TransactionQueryItem> {
  const data = await requestGraphQL<{ updateTransaction: TransactionQueryItem }>(
    updateTransactionMutation,
    {
      token,
      variables: { id, input },
    },
  )

  return data.updateTransaction
}

export async function deleteTransaction(
  token: string,
  id: string,
): Promise<TransactionQueryItem> {
  const data = await requestGraphQL<{ deleteTransaction: TransactionQueryItem }>(
    deleteTransactionMutation,
    {
      token,
      variables: { id },
    },
  )

  return data.deleteTransaction
}
