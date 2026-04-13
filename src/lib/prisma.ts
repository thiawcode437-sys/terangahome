import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function createPrismaClient() {
  const neonUrl = process.env.DATABASE_URL;

  if (neonUrl && neonUrl.startsWith("postgresql")) {
    // Production: use Neon PostgreSQL
    const adapter = new PrismaNeon({ connectionString: neonUrl });
    return new PrismaClient({ adapter });
  }

  // Fallback: Prisma without adapter (for local dev with direct connection)
  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
