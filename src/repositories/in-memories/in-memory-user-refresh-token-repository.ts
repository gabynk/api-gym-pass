import { Prisma, UserRefreshToken } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { UserRefreshTokenRepository } from '../user-refresh-token-repository'

export class InMemoryUserRefreshTokenRepository implements UserRefreshTokenRepository {
  public items: UserRefreshToken[] = []

  async create(data: Prisma.UserRefreshTokenUncheckedCreateInput) {
    const token = {
      id: randomUUID(),
      token_hash: data.token_hash,
      expires_at: new Date(data.expires_at),
      revoked_at: null,
      created_at: new Date(),
      user_id: data.user_id,
      revoked_by_id: null,
    }

    this.items.push(token)

    return token
  }
}
