import type { User } from "@prisma/client";
import { badUserInput, unauthenticated } from "../graphql/errors.js";
import { prisma } from "../lib/prisma.js";
import { createAuthToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

type CreateAccountInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type UpdateProfileInput = {
  name: string;
};

type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type AuthPayload = {
  token: string;
  user: PublicUser;
};

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateName(name: string): string {
  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    throw badUserInput("Name must have at least 2 characters");
  }

  if (trimmedName.length > 120) {
    throw badUserInput("Name must have at most 120 characters");
  }

  return trimmedName;
}

function validateEmail(email: string): string {
  const normalizedEmail = normalizeEmail(email);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw badUserInput("Invalid email");
  }

  return normalizedEmail;
}

function validatePassword(password: string): string {
  if (password.length < 6) {
    throw badUserInput("Password must have at least 6 characters");
  }

  if (password.length > 72) {
    throw badUserInput("Password must have at most 72 characters");
  }

  return password;
}

export async function createAccount(input: CreateAccountInput): Promise<AuthPayload> {
  const name = validateName(input.name);
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw badUserInput("Email is already in use");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
    },
  });

  return {
    token: createAuthToken(user.id),
    user: toPublicUser(user),
  };
}

export async function login(input: LoginInput): Promise<AuthPayload> {
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw badUserInput("Invalid email or password");
  }

  return {
    token: createAuthToken(user.id),
    user: toPublicUser(user),
  };
}

export async function getAuthenticatedUser(userId: string | undefined): Promise<PublicUser> {
  if (!userId) {
    throw unauthenticated();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw unauthenticated();
  }

  return toPublicUser(user);
}

export async function updateProfile(
  userId: string | undefined,
  input: UpdateProfileInput,
): Promise<PublicUser> {
  if (!userId) {
    throw unauthenticated();
  }

  const user = await prisma.user.update({
    data: {
      name: validateName(input.name),
    },
    where: { id: userId },
  });

  return toPublicUser(user);
}
