import {
  createAccount,
  getAuthenticatedUser,
  login,
} from "../services/auth.service.js";
import type { GraphQLContext } from "./context.js";

type CreateAccountArgs = {
  input: {
    name: string;
    email: string;
    password: string;
  };
};

type LoginArgs = {
  input: {
    email: string;
    password: string;
  };
};

export const authTypeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateAccountInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }
`;

export const authResolvers = {
  Query: {
    me: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      getAuthenticatedUser(context.userId),
  },
  Mutation: {
    createAccount: (_parent: unknown, args: CreateAccountArgs) =>
      createAccount(args.input),
    login: (_parent: unknown, args: LoginArgs) => login(args.input),
  },
};
