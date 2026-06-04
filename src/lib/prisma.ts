import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Mock Prisma client for development without database
class MockPrismaClient {
  user = {
    findUnique: async () => null,
    findFirst: async () => null,
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    update: async (data: any) => ({ id: 'mock-id', ...data.data }),
    delete: async () => ({ id: 'mock-id' }),
    findMany: async () => [],
  }
  portfolio = {
    findMany: async () => [],
    findFirst: async () => null,
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    update: async (data: any) => ({ id: 'mock-id', ...data.data }),
    delete: async () => ({ id: 'mock-id' }),
    count: async () => 0,
  }
  $connect = async () => {}
  $disconnect = async () => {}
}

function createPrismaClient() {
  // If no DATABASE_URL, use mock client
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL found, using mock Prisma client')
    return new MockPrismaClient() as any
  }

  try {
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to create Prisma client, using mock:', error)
    return new MockPrismaClient() as any
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
