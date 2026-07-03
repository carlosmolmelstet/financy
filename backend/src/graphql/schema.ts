export const typeDefs = `#graphql
  type HealthCheck {
    ok: Boolean!
    service: String!
    timestamp: String!
  }

  type Query {
    health: HealthCheck!
  }
`;

export const resolvers = {
  Query: {
    health: () => ({
      ok: true,
      service: "financy-backend",
      timestamp: new Date().toISOString(),
    }),
  },
};
