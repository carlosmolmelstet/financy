import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../services/category.service.js";
import type { GraphQLContext } from "./context.js";

type CreateCategoryArgs = {
  input: {
    name: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
  };
};

type UpdateCategoryArgs = {
  id: string;
  input: {
    name?: string | null;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
  };
};

type DeleteCategoryArgs = {
  id: string;
};

export const categoryTypeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
    description: String
    color: String
    icon: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateCategoryInput {
    name: String!
    description: String
    color: String
    icon: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
    color: String
    icon: String
  }
`;

export const categoryResolvers = {
  Query: {
    categories: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      listCategories(context.userId),
  },
  Mutation: {
    createCategory: (
      _parent: unknown,
      args: CreateCategoryArgs,
      context: GraphQLContext,
    ) => createCategory(context.userId, args.input),
    updateCategory: (
      _parent: unknown,
      args: UpdateCategoryArgs,
      context: GraphQLContext,
    ) => updateCategory(context.userId, args.id, args.input),
    deleteCategory: (
      _parent: unknown,
      args: DeleteCategoryArgs,
      context: GraphQLContext,
    ) => deleteCategory(context.userId, args.id),
  },
};
