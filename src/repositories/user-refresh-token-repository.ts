import { Prisma, UserRefreshToken } from '@prisma/client'

export interface UserRefreshTokenRepository {
  create(data: Prisma.UserRefreshTokenUncheckedCreateInput): Promise<UserRefreshToken>
  getByActiveJtiAndUserId(jti: string, userId: string): Promise<UserRefreshToken | null>
  getByUserId(userId: string): Promise<UserRefreshToken[]>
  revokingByJti(jti: string, userId: string): Promise<UserRefreshToken | null>
  revokingAllByUserId(userId: string, revokedById: string): Promise<UserRefreshToken[]>
}
