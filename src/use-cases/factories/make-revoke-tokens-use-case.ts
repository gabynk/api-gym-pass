import { PrismaUserRefreshTokenRepository } from "@/repositories/prisma/prisma-user-refresh-token-repository"
import { RevokeTokensUseCase } from "../revoke-all-tokens"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"

export function MakeRevokeTokensUseCase() {
  const userRefreshTokenRepository = new PrismaUserRefreshTokenRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RevokeTokensUseCase(userRefreshTokenRepository, usersRepository)

  return useCase
}
