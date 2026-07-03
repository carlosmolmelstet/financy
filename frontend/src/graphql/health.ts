import { requestGraphQL } from '../lib/graphql-client'

export type HealthCheck = {
  ok: boolean
  service: string
  timestamp: string
}

type HealthQueryData = {
  health: HealthCheck
}

const healthQuery = `#graphql
  query Health {
    health {
      ok
      service
      timestamp
    }
  }
`

export async function getHealth(): Promise<HealthCheck> {
  const data = await requestGraphQL<HealthQueryData>(healthQuery)

  return data.health
}
