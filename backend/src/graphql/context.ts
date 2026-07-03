import type { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { getUserIdFromToken } from "../utils/jwt.js";

export type GraphQLContext = {
  authToken?: string;
  requestId?: string;
  userId?: string;
};

export async function createGraphQLContext({
  req,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> {
  const context: GraphQLContext = {};
  const authorization = req.headers.authorization;
  const requestId = req.headers["x-request-id"];

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice("Bearer ".length);
    const userId = getUserIdFromToken(token);

    context.authToken = token;

    if (userId) {
      context.userId = userId;
    }
  }

  if (typeof requestId === "string" && requestId.length > 0) {
    context.requestId = requestId;
  }

  return context;
}
