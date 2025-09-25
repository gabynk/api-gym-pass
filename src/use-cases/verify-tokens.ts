import { UserRefreshTokenRepository } from '@/repositories/user-refresh-token-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

interface VerifyTokensUseCaseRequest {
  jti: string
  userId: string
}

export class VerifyTokensUseCase {
  constructor(private userRefreshTokenRepository: UserRefreshTokenRepository) { }

  async execute({
    jti,
    userId,
  }: VerifyTokensUseCaseRequest) {
    const token = await this.userRefreshTokenRepository.getByActiveJtiAndUserId(jti, userId)

    if (!token) {
      throw new UnauthorizedError()
    }

    return {
      token
    }
  }
}
