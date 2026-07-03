import { env } from './env'

type GraphQLErrorResponse = {
  message: string
}

type GraphQLResponse<TData> = {
  data?: TData
  errors?: GraphQLErrorResponse[]
}

type GraphQLRequestOptions = {
  token?: string
}

export async function requestGraphQL<TData>(
  query: string,
  options: GraphQLRequestOptions = {},
): Promise<TData> {
  const response = await fetch(env.backendUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
    },
    body: JSON.stringify({ query }),
  })

  const payload = (await response.json()) as GraphQLResponse<TData>

  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message || 'GraphQL request failed')
  }

  if (!payload.data) {
    throw new Error('GraphQL response did not include data')
  }

  return payload.data
}
