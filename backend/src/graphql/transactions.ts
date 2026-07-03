import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "../services/transaction.service.js";
import type { GraphQLContext } from "./context.js";

type CreateTransactionArgs = {
  input: {
    description: string;
    amount: number;
    type: string;
    transactionDate: string;
    categoryId?: string | null;
  };
};

type UpdateTransactionArgs = {
  id: string;
  input: {
    description?: string | null;
    amount?: number | null;
    type?: string | null;
    transactionDate?: string | null;
    categoryId?: string | null;
  };
};

type DeleteTransactionArgs = {
  id: string;
};

export const transactionTypeDefs = `#graphql
  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    type: String!
    transactionDate: String!
    categoryId: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateTransactionInput {
    description: String!
    amount: Float!
    type: String!
    transactionDate: String!
    categoryId: String
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    type: String
    transactionDate: String
    categoryId: String
  }
`;

export const transactionResolvers = {
  Query: {
    transactions: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      listTransactions(context.userId),
  },
  Mutation: {
    createTransaction: (
      _parent: unknown,
      args: CreateTransactionArgs,
      context: GraphQLContext,
    ) => createTransaction(context.userId, args.input),
    updateTransaction: (
      _parent: unknown,
      args: UpdateTransactionArgs,
      context: GraphQLContext,
    ) => updateTransaction(context.userId, args.id, args.input),
    deleteTransaction: (
      _parent: unknown,
      args: DeleteTransactionArgs,
      context: GraphQLContext,
    ) => deleteTransaction(context.userId, args.id),
  },
};
