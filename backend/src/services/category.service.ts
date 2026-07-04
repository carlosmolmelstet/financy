import type { Category } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { badUserInput, unauthenticated } from "../graphql/errors.js";
import { prisma } from "../lib/prisma.js";

type CreateCategoryInput = {
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
};

type UpdateCategoryInput = {
  name?: string | null;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
};

type DeleteCategoryOptions = {
  deleteTransactions?: boolean | null | undefined;
};

type PublicCategory = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
};

function requireUserId(userId: string | undefined): string {
  if (!userId) {
    throw unauthenticated();
  }

  return userId;
}

function toPublicCategory(category: Category): PublicCategory {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    color: category.color,
    icon: category.icon,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

function normalizeOptionalText(value: string | null | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

function validateName(name: string): string {
  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    throw badUserInput("Category name must have at least 2 characters");
  }

  if (trimmedName.length > 80) {
    throw badUserInput("Category name must have at most 80 characters");
  }

  return trimmedName;
}

function validateColor(color: string | null | undefined): string | null | undefined {
  const normalizedColor = normalizeOptionalText(color);

  if (normalizedColor === undefined || normalizedColor === null) {
    return normalizedColor;
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(normalizedColor)) {
    throw badUserInput("Category color must be a hex color like #22C55E");
  }

  return normalizedColor.toUpperCase();
}

function validateIcon(icon: string | null | undefined): string | null | undefined {
  const normalizedIcon = normalizeOptionalText(icon);

  if (normalizedIcon && normalizedIcon.length > 60) {
    throw badUserInput("Category icon must have at most 60 characters");
  }

  return normalizedIcon;
}

function validateDescription(
  description: string | null | undefined,
): string | null | undefined {
  const normalizedDescription = normalizeOptionalText(description);

  if (normalizedDescription && normalizedDescription.length > 240) {
    throw badUserInput("Category description must have at most 240 characters");
  }

  return normalizedDescription;
}

function handleCategoryError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw badUserInput("A category with this name already exists");
  }

  throw error;
}

export async function listCategories(userId: string | undefined): Promise<PublicCategory[]> {
  const ownerId = requireUserId(userId);

  const categories = await prisma.category.findMany({
    where: {
      userId: ownerId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map(toPublicCategory);
}

export async function createCategory(
  userId: string | undefined,
  input: CreateCategoryInput,
): Promise<PublicCategory> {
  const ownerId = requireUserId(userId);
  const data: Prisma.CategoryUncheckedCreateInput = {
    name: validateName(input.name),
    userId: ownerId,
  };
  const description = validateDescription(input.description);
  const color = validateColor(input.color);
  const icon = validateIcon(input.icon);

  if (description !== undefined) {
    data.description = description;
  }

  if (color !== undefined) {
    data.color = color;
  }

  if (icon !== undefined) {
    data.icon = icon;
  }

  try {
    const category = await prisma.category.create({
      data,
    });

    return toPublicCategory(category);
  } catch (error) {
    handleCategoryError(error);
  }
}

export async function updateCategory(
  userId: string | undefined,
  categoryId: string,
  input: UpdateCategoryInput,
): Promise<PublicCategory> {
  const ownerId = requireUserId(userId);

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId: ownerId,
    },
  });

  if (!category) {
    throw badUserInput("Category not found");
  }
  const data: Prisma.CategoryUncheckedUpdateInput = {};

  if (input.name !== undefined) {
    data.name = validateName(input.name ?? "");
  }

  if (input.description !== undefined) {
    const description = validateDescription(input.description);

    if (description !== undefined) {
      data.description = description;
    }
  }

  if (input.color !== undefined) {
    const color = validateColor(input.color);

    if (color !== undefined) {
      data.color = color;
    }
  }

  if (input.icon !== undefined) {
    const icon = validateIcon(input.icon);

    if (icon !== undefined) {
      data.icon = icon;
    }
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
      data,
    });

    return toPublicCategory(updatedCategory);
  } catch (error) {
    handleCategoryError(error);
  }
}

export async function deleteCategory(
  userId: string | undefined,
  categoryId: string,
  options: DeleteCategoryOptions = {},
): Promise<PublicCategory> {
  const ownerId = requireUserId(userId);

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId: ownerId,
    },
  });

  if (!category) {
    throw badUserInput("Category not found");
  }

  await prisma.$transaction(async (transaction) => {
    if (options.deleteTransactions) {
      await transaction.transaction.deleteMany({
        where: {
          categoryId: category.id,
          userId: ownerId,
        },
      });
    } else {
      await transaction.transaction.updateMany({
        where: {
          categoryId: category.id,
          userId: ownerId,
        },
        data: {
          categoryId: null,
        },
      });
    }

    await transaction.category.delete({
      where: {
        id: category.id,
      },
    });
  });

  return toPublicCategory(category);
}
