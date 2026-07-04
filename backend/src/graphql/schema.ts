import { authResolvers, authTypeDefs } from "./auth.js";
import { categoryResolvers, categoryTypeDefs } from "./categories.js";
import { transactionResolvers, transactionTypeDefs } from "./transactions.js";

export const typeDefs = `#graphql
  type HealthCheck {
    ok: Boolean!
    service: String!
    timestamp: String!
  }

  type Query {
    health: HealthCheck!
    me: User!
    categories: [Category!]!
    transactions: [Transaction!]!
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!, deleteTransactions: Boolean): Category!
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Transaction!
  }

  ${authTypeDefs}
  ${categoryTypeDefs}
  ${transactionTypeDefs}
`;

export const resolvers = {
  Query: {
    health: () => ({
      ok: true,
      service: "financy-backend",
      timestamp: new Date().toISOString(),
    }),
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
};
