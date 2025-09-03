import { UserRefreshTokenRepository } from '@/repositories/user-refresh-token-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { UserRefreshToken } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface RevokeTokenByJtiUseCaseRequest {
  userId: string
  jti: string
}

interface RevokeTokenByJtiUseCaseResponse {
  token: UserRefreshToken | null
}

export class RevokeTokenByJtiUseCase {
  constructor(
    private userRefreshTokenRepository: UserRefreshTokenRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    userId,
    jti
  }: RevokeTokenByJtiUseCaseRequest): Promise<RevokeTokenByJtiUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    let token = null
    if (user) {
      token = await this.userRefreshTokenRepository.revokingByJti(jti, userId)
    }

    return {
      token
    }
  }
}
