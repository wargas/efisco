import { BunPostgresAdapter } from "@wargas/prisma-adapter-bun"
import { PrismaClient } from "./generated/prisma/client"

const adapter = new BunPostgresAdapter(process.env.DATABASE_URL!)

export const prisma = new PrismaClient({ adapter })