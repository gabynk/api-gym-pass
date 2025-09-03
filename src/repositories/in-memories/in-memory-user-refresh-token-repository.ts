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
      jti: data.jti,
      replaced_by_jti: data.replaced_by_jti ?? null
    }

    this.items.push(token)

    return token
  }

  async getByActiveJti(jti: string) {
    return this.items.find((item) => {
      return item.jti === jti
        && item.expires_at > new Date()
        && item.revoked_by_id === null
        && item.revoked_at === null
        && item.replaced_by_jti === null
    }) || null
  }

  async getByUserId(userId: string) {
    return this.items.filter((item) => {
      return item.user_id === userId
        && item.expires_at > new Date()
        && item.revoked_by_id === null
        && item.revoked_at === null
        && item.replaced_by_jti === null
    })
  }

  async revokingByJti(jti: string, userId: string) {
    const tokenInIndex = this.items.findIndex((item) => item.jti === jti)
    let token = null
    if (tokenInIndex >= 0) {
      this.items[tokenInIndex].revoked_at = new Date()
      this.items[tokenInIndex].revoked_by_id = userId

      token = this.items[tokenInIndex]
    }

    return token
  }

  async revokingAllByUserId(revokingUserId: string, revokedById: string) {
    const tokens = this.items.map((item) => {
      if (item.user_id === revokingUserId) {
        return {
          ...item,
          revoked_at: new Date(),
          revoked_by_id: revokedById
        }
      }
      return item
    })

    this.items = tokens

    return tokens.filter(item => item.user_id === revokingUserId)
  }
}
