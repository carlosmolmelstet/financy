import type { ExpressContextFunctionArgument } from "@as-integrations/express5";

export type GraphQLContext = {
  authToken?: string;
  requestId?: string;
};

export async function createGraphQLContext({
  req,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> {
  const context: GraphQLContext = {};
  const authorization = req.headers.authorization;
  const requestId = req.headers["x-request-id"];

  if (authorization?.startsWith("Bearer ")) {
    context.authToken = authorization.slice("Bearer ".length);
  }

  if (typeof requestId === "string" && requestId.length > 0) {
    context.requestId = requestId;
  }

  return context;
}
