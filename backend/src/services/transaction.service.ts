import type { Transaction } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { badUserInput, unauthenticated } from "../graphql/errors.js";
import { prisma } from "../lib/prisma.js";

const transactionTypes = ["INCOME", "EXPENSE"] as const;

type TransactionType = (typeof transactionTypes)[number];

type CreateTransactionInput = {
  description: string;
  amount: number;
  type: string;
  transactionDate: string;
  categoryId?: string | null;
};

type UpdateTransactionInput = {
  description?: string | null;
  amount?: number | null;
  type?: string | null;
  transactionDate?: string | null;
  categoryId?: string | null;
};

type PublicTransaction = {
  id: string;
  description: string;
  amount: number;
  type: string;
  transactionDate: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
};

function requireUserId(userId: string | undefined): string {
  if (!userId) {
    throw unauthenticated();
  }

  return userId;
}

function toPublicTransaction(transaction: Transaction): PublicTransaction {
  return {
    id: transaction.id,
    description: transaction.description,
    amount: transaction.amount.toNumber(),
    type: transaction.type,
    transactionDate: transaction.transactionDate.toISOString(),
    categoryId: transaction.categoryId,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

function validateDescription(description: string): string {
  const trimmedDescription = description.trim();

  if (trimmedDescription.length < 2) {
    throw badUserInput("Transaction description must have at least 2 characters");
  }

  if (trimmedDescription.length > 140) {
    throw badUserInput("Transaction description must have at most 140 characters");
  }

  return trimmedDescription;
}

function validateAmount(amount: number): Prisma.Decimal {
  if (!Number.isFinite(amount)) {
    throw badUserInput("Transaction amount must be a valid number");
  }

  if (amount <= 0) {
    throw badUserInput("Transaction amount must be greater than zero");
  }

  return new Prisma.Decimal(amount.toFixed(2));
}

function validateType(type: string): TransactionType {
  const normalizedType = type.trim().toUpperCase();

  if (!transactionTypes.includes(normalizedType as TransactionType)) {
    throw badUserInput("Transaction type must be INCOME or EXPENSE");
  }

  return normalizedType as TransactionType;
}

function validateTransactionDate(transactionDate: string): Date {
  const date = new Date(transactionDate);

  if (Number.isNaN(date.getTime())) {
    throw badUserInput("Transaction date must be a valid date");
  }

  return date;
}

async function ensureCategoryBelongsToUser(
  categoryId: string | null | undefined,
  userId: string,
): Promise<string | null | undefined> {
  if (categoryId === undefined || categoryId === null) {
    return categoryId;
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw badUserInput("Category not found");
  }

  return category.id;
}

export async function listTransactions(
  userId: string | undefined,
): Promise<PublicTransaction[]> {
  const ownerId = requireUserId(userId);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: ownerId,
    },
    orderBy: {
      transactionDate: "desc",
    },
  });

  return transactions.map(toPublicTransaction);
}

export async function createTransaction(
  userId: string | undefined,
  input: CreateTransactionInput,
): Promise<PublicTransaction> {
  const ownerId = requireUserId(userId);
  const categoryId = await ensureCategoryBelongsToUser(input.categoryId, ownerId);

  const data: Prisma.TransactionUncheckedCreateInput = {
    description: validateDescription(input.description),
    amount: validateAmount(input.amount),
    type: validateType(input.type),
    transactionDate: validateTransactionDate(input.transactionDate),
    userId: ownerId,
  };

  if (categoryId !== undefined) {
    data.categoryId = categoryId;
  }

  const transaction = await prisma.transaction.create({
    data,
  });

  return toPublicTransaction(transaction);
}

export async function updateTransaction(
  userId: string | undefined,
  transactionId: string,
  input: UpdateTransactionInput,
): Promise<PublicTransaction> {
  const ownerId = requireUserId(userId);

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: ownerId,
    },
  });

  if (!transaction) {
    throw badUserInput("Transaction not found");
  }

  const data: Prisma.TransactionUncheckedUpdateInput = {};

  if (input.description !== undefined) {
    data.description = validateDescription(input.description ?? "");
  }

  if (input.amount !== undefined) {
    data.amount = validateAmount(input.amount ?? Number.NaN);
  }

  if (input.type !== undefined) {
    data.type = validateType(input.type ?? "");
  }

  if (input.transactionDate !== undefined) {
    data.transactionDate = validateTransactionDate(input.transactionDate ?? "");
  }

  if (input.categoryId !== undefined) {
    const categoryId = await ensureCategoryBelongsToUser(input.categoryId, ownerId);

    if (categoryId !== undefined) {
      data.categoryId = categoryId;
    }
  }

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: transaction.id,
    },
    data,
  });

  return toPublicTransaction(updatedTransaction);
}

export async function deleteTransaction(
  userId: string | undefined,
  transactionId: string,
): Promise<PublicTransaction> {
  const ownerId = requireUserId(userId);

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: ownerId,
    },
  });

  if (!transaction) {
    throw badUserInput("Transaction not found");
  }

  await prisma.transaction.delete({
    where: {
      id: transaction.id,
    },
  });

  return toPublicTransaction(transaction);
}
