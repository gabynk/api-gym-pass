import { hash } from 'bcryptjs'
import { UserRefreshTokenRepository } from '@/repositories/user-refresh-token-repository'
import dayjs from 'dayjs'
import { UserRefreshToken } from '@prisma/client'

interface CreateTokensUseCaseRequest {
  refreshToken: string
  userId: string
}

interface CreateTokensUseCaseRequestResponse {
  tokens: UserRefreshToken
}

export class CreateTokensUseCase {
  constructor(private userRefreshTokenRepository: UserRefreshTokenRepository) { }

  async execute({
    refreshToken,
    userId
  }: CreateTokensUseCaseRequest): Promise<CreateTokensUseCaseRequestResponse> {
    const token_hash = await hash(refreshToken, 6)
    const expires_at = dayjs().add(7, 'days')

    const tokens = await this.userRefreshTokenRepository.create({
      token_hash,
      expires_at: new Date(expires_at.toDate()),
      user_id: userId
    })

    return {
      tokens
    }
  }
}
