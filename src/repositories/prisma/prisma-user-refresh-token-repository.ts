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

  async getByActiveJtiAndUserId(jti: string, userId: string) {
    const token = await prisma.userRefreshToken.findUnique({
      where: {
        jti,
        expires_at: {
          gte: new Date()
        },
        revoked_at: null,
        revoked_by_id: null,
        user_id: userId
      }
    })

    return token
  }

  async getByUserId(user_id: string) {
    const token = await prisma.userRefreshToken.findMany({
      where: {
        user_id,
        expires_at: {
          gte: new Date()
        },
        revoked_at: null,
        revoked_by_id: null
      }
    })

    return token
  }

  async revokingByJti(jti: string, userId: string) {
    const token = await prisma.userRefreshToken.update({
      where: {
        jti,
      },
      data: {
        revoked_at: new Date(),
        revoked_by_id: userId
      }
    })

    return token
  }

  async revokingAllByUserId(user_id: string, revoked_by_id: string) {
    const token = await prisma.userRefreshToken.updateManyAndReturn({
      where: {
        user_id,
      },
      data: {
        revoked_at: new Date(),
        revoked_by_id
      }
    })

    return token
  }
}
