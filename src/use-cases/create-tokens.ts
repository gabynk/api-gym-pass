import { hash } from 'bcryptjs'
import { UserRefreshTokenRepository } from '@/repositories/user-refresh-token-repository'
import dayjs from 'dayjs'
import { UserRefreshToken } from '@prisma/client'

interface CreateTokensUseCaseRequest {
  refreshToken: string
  userId: string
  jti: string
  oldJti?: string
  expiresAt?: Date | null
}

interface CreateTokensUseCaseRequestResponse {
  token: UserRefreshToken
}

export class CreateTokensUseCase {
  constructor(private userRefreshTokenRepository: UserRefreshTokenRepository) { }

  async execute({
    refreshToken,
    userId,
    jti,
    oldJti,
    expiresAt = null,
  }: CreateTokensUseCaseRequest): Promise<CreateTokensUseCaseRequestResponse> {
    const token_hash = refreshToken // await hash(refreshToken, 6)
    const expires_at = dayjs().add(7, 'days')

    const token = await this.userRefreshTokenRepository.create({
      token_hash,
      expires_at: new Date(expiresAt || expires_at.toDate()),
      user_id: userId,
      jti,
      replaced_by_jti: oldJti || null
    })

    return {
      token
    }
  }
}
