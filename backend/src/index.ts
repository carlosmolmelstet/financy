import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { createGraphQLContext, type GraphQLContext } from "./graphql/context.js";
import { resolvers, typeDefs } from "./graphql/schema.js";

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );

  app.get("/health", (_request, response) => {
    response.status(200).json({
      ok: true,
      service: "financy-backend",
    });
  });

  const apolloServer = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, {
      context: createGraphQLContext,
    }),
  );

  app.listen(env.port, () => {
    console.log(`Backend running at http://localhost:${env.port}/graphql`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to start backend");
  console.error(error);
  process.exit(1);
});
