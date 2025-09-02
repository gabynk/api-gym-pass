import { UserRefreshTokenRepository } from '@/repositories/user-refresh-token-repository'
import { UnauthorizedError } from './errors/unauthorized-error'
import { UsersRepository } from '@/repositories/users-repository'
import { UserRefreshToken } from '@prisma/client'

interface RevokeTokensUseCaseRequest {
  actorId: string
  targetUserId: string
}

interface RevokeTokensUseCaseResponse {
  tokens: UserRefreshToken[]
}

export class RevokeTokensUseCase {
  constructor(
    private userRefreshTokenRepository: UserRefreshTokenRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    actorId,
    targetUserId
  }: RevokeTokensUseCaseRequest): Promise<RevokeTokensUseCaseResponse> {
    const actorUser = await this.usersRepository.findById(actorId)

    if (!actorUser || actorUser?.role !== 'ADMIN') {
      throw new UnauthorizedError()
    }

    const targetUser = await this.usersRepository.findById(targetUserId)

    let tokens: UserRefreshToken[] = []
    if (targetUser) {
      tokens = await this.userRefreshTokenRepository.revokingByUserId(targetUser.id, actorUser.id)
    }

    return {
      tokens
    }
  }
}
