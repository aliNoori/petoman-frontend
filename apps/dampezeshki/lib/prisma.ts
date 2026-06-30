import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

declare global {
  var __prisma: any | undefined
}

export const prisma = globalThis.__prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
