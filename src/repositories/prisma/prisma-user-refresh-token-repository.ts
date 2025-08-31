import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UserRefreshTokenRepository } from '../user-refresh-token-repository'

export class PrismaUserRefreshTokenRepository implements UserRefreshTokenRepository {
  async create(data: Prisma.UserRefreshTokenUncheckedCreateInput) {
    const token = await prisma.userRefreshToken.create({
      data,
    })

    return token
  }
}
