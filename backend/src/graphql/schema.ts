import { authResolvers, authTypeDefs } from "./auth.js";

export const typeDefs = `#graphql
  type HealthCheck {
    ok: Boolean!
    service: String!
    timestamp: String!
  }

  type Query {
    health: HealthCheck!
    me: User!
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }

  ${authTypeDefs}
`;

export const resolvers = {
  Query: {
    health: () => ({
      ok: true,
      service: "financy-backend",
      timestamp: new Date().toISOString(),
    }),
    ...authResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
