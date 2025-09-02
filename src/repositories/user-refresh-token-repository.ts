import { Prisma, UserRefreshToken } from '@prisma/client'

export interface UserRefreshTokenRepository {
  create(data: Prisma.UserRefreshTokenUncheckedCreateInput): Promise<UserRefreshToken>
  getByUserId(userId: string): Promise<UserRefreshToken[]>
  revokingByUserId(userId: string, revokedById: string): Promise<UserRefreshToken[]>
}
