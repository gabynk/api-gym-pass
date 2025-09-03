import { UserRefreshTokenRepository } from '@/repositories/user-refresh-token-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

interface VerifyTokensUseCaseRequest {
  jti: string
}

export class VerifyTokensUseCase {
  constructor(private userRefreshTokenRepository: UserRefreshTokenRepository) { }

  async execute({
    jti
  }: VerifyTokensUseCaseRequest) {
    const token = await this.userRefreshTokenRepository.getByActiveJti(jti)

    if (!token) {
      throw new UnauthorizedError()
    }

    return {
      token
    }
  }
}
