import type { TagTone } from '../components/ui'
import { requestGraphQL } from '../lib/graphql-client'

export type Category = {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  createdAt: string
  updatedAt: string
}

type CategoryTransaction = {
  id: string
  categoryId: string | null
}

export type CategoryWithStats = Category & {
  tone: TagTone
  transactionCount: number
}

export type CategoriesData = {
  categories: CategoryWithStats[]
  mostUsedCategory: CategoryWithStats | null
  totalCategories: number
  totalTransactions: number
}

export type CategoryFormInput = {
  name: string
  description: string | null
  color: string
  icon: string
}

type CategoriesQueryData = {
  categories: Category[]
  transactions: CategoryTransaction[]
}

const categoriesQuery = `#graphql
  query CategoriesPage {
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
      categoryId
    }
  }
`

const categoryFields = `
  id
  name
  description
  color
  icon
  createdAt
  updatedAt
`

const createCategoryMutation = `#graphql
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ${categoryFields}
    }
  }
`

const updateCategoryMutation = `#graphql
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ${categoryFields}
    }
  }
`

const deleteCategoryMutation = `#graphql
  mutation DeleteCategory($id: ID!, $deleteTransactions: Boolean) {
    deleteCategory(id: $id, deleteTransactions: $deleteTransactions) {
      ${categoryFields}
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

function buildCategoriesData(data: CategoriesQueryData): CategoriesData {
  const transactionCountByCategoryId = new Map<string, number>()

  for (const transaction of data.transactions) {
    if (!transaction.categoryId) {
      continue
    }

    transactionCountByCategoryId.set(
      transaction.categoryId,
      (transactionCountByCategoryId.get(transaction.categoryId) ?? 0) + 1,
    )
  }

  const categories = data.categories
    .map((category) => ({
      ...category,
      tone: getCategoryTone(category.color),
      transactionCount: transactionCountByCategoryId.get(category.id) ?? 0,
    }))
    .sort((first, second) => {
      const countDifference = second.transactionCount - first.transactionCount

      if (countDifference !== 0) {
        return countDifference
      }

      return first.name.localeCompare(second.name, 'pt-BR')
    })

  const mostUsedCategory = categories.reduce<CategoryWithStats | null>(
    (currentMostUsed, category) => {
      if (!currentMostUsed) {
        return category.transactionCount > 0 ? category : null
      }

      return category.transactionCount > currentMostUsed.transactionCount
        ? category
        : currentMostUsed
    },
    null,
  )

  return {
    categories,
    mostUsedCategory,
    totalCategories: categories.length,
    totalTransactions: data.transactions.length,
  }
}

export async function getCategoriesData(token: string): Promise<CategoriesData> {
  const data = await requestGraphQL<CategoriesQueryData>(categoriesQuery, { token })

  return buildCategoriesData(data)
}

export async function createCategory(
  token: string,
  input: CategoryFormInput,
): Promise<Category> {
  const data = await requestGraphQL<{ createCategory: Category }>(createCategoryMutation, {
    token,
    variables: { input },
  })

  return data.createCategory
}

export async function updateCategory(
  token: string,
  id: string,
  input: CategoryFormInput,
): Promise<Category> {
  const data = await requestGraphQL<{ updateCategory: Category }>(updateCategoryMutation, {
    token,
    variables: { id, input },
  })

  return data.updateCategory
}

export async function deleteCategory(
  token: string,
  id: string,
  deleteTransactions: boolean,
): Promise<Category> {
  const data = await requestGraphQL<{ deleteCategory: Category }>(deleteCategoryMutation, {
    token,
    variables: { deleteTransactions, id },
  })

  return data.deleteCategory
}
