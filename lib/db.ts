import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// we could have have done just export const db=new PrismaClient() , but we dont
// We dont do it because during development we want only one client and not
// multiple clients to generate due to nextjs "hot reload" feature.
