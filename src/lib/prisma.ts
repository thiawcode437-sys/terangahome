import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuth = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    // Production: use Turso cloud database
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: tursoAuth,
    });
    return new PrismaClient({ adapter });
  }

  // Development: use local SQLite file
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
