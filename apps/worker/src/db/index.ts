import { Env } from "@repo/types/index";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


export function dbClient(env: Env) {
  const { DATABASE_URL } = env;

  if (!DATABASE_URL) {
    throw new Error("DataBase credentials not found");
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());

  console.log("dbClient initialized");
  return prisma;
}
