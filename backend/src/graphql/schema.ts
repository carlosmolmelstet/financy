import { authResolvers, authTypeDefs } from "./auth.js";
import { categoryResolvers, categoryTypeDefs } from "./categories.js";

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
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Category!
  }

  ${authTypeDefs}
  ${categoryTypeDefs}
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
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
  },
};
