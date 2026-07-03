import "dotenv/config";

const requiredEnvNames = ["JWT_SECRET", "DATABASE_URL"] as const;

type RequiredEnvName = (typeof requiredEnvNames)[number];

function readRequiredEnv(name: RequiredEnvName): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readPort(): number {
  const value = Number(process.env.PORT ?? 4000);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: readPort(),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  jwtSecret: readRequiredEnv("JWT_SECRET"),
  databaseUrl: readRequiredEnv("DATABASE_URL"),
};
