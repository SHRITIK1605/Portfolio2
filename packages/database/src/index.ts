import { PrismaClient } from "@prisma/client";

// Vercel dashboard may use alternate names for these secrets.
if (!process.env.DATABASE_URL?.trim() && process.env.NEON?.trim()) {
  process.env.DATABASE_URL = process.env.NEON.trim();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
