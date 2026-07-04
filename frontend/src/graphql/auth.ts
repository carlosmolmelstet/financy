import { requestGraphQL } from '../lib/graphql-client'

export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export type AuthPayload = {
  token: string
  user: AuthUser
}

type CreateAccountInput = {
  name: string
  email: string
  password: string
}

type LoginInput = {
  email: string
  password: string
}

const userFields = `
  id
  name
  email
  createdAt
  updatedAt
`

export async function createAccount(input: CreateAccountInput): Promise<AuthPayload> {
  const data = await requestGraphQL<{ createAccount: AuthPayload }>(
    `
      mutation CreateAccount($input: CreateAccountInput!) {
        createAccount(input: $input) {
          token
          user {
            ${userFields}
          }
        }
      }
    `,
    {
      variables: { input },
    },
  )

  return data.createAccount
}

export async function login(input: LoginInput): Promise<AuthPayload> {
  const data = await requestGraphQL<{ login: AuthPayload }>(
    `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            ${userFields}
          }
        }
      }
    `,
    {
      variables: { input },
    },
  )

  return data.login
}

export async function getAuthenticatedUser(token: string): Promise<AuthUser> {
  const data = await requestGraphQL<{ me: AuthUser }>(
    `
      query Me {
        me {
          ${userFields}
        }
      }
    `,
    { token },
  )

  return data.me
}
