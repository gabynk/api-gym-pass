import { UserRefreshTokenRepository } from '@/repositories/user-refresh-token-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

interface VerifyTokensUseCaseRequest {
  userId: string
}

export class VerifyTokensUseCase {
  constructor(private userRefreshTokenRepository: UserRefreshTokenRepository) { }

  async execute({
    userId
  }: VerifyTokensUseCaseRequest) {
    const tokens = await this.userRefreshTokenRepository.getByUserId(userId)

    if (!tokens || tokens.length <= 0) {
      throw new UnauthorizedError()
    }

    return {
      tokens
    }
  }
}
