import { PrismaUserRefreshTokenRepository } from "@/repositories/prisma/prisma-user-refresh-token-repository"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RevokeTokenByJtiUseCase } from "../revoke-token-by-jti"

export function MakeRevokeTokenByJtiUseCase() {
  const userRefreshTokenRepository = new PrismaUserRefreshTokenRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RevokeTokenByJtiUseCase(userRefreshTokenRepository, usersRepository)

  return useCase
}
