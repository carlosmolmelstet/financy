import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

const expiresIn = "7d";

export function createAuthToken(userId: string): string {
  return jwt.sign({}, env.jwtSecret, {
    subject: userId,
    expiresIn,
  });
}

export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload | string;

    if (typeof payload === "string") {
      return null;
    }

    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
