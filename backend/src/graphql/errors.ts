import { GraphQLError } from "graphql";

export function badUserInput(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT",
    },
  });
}

export function unauthenticated(message = "Authentication required"): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  });
}
