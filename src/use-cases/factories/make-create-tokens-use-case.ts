import { PrismaUserRefreshTokenRepository } from "@/repositories/prisma/prisma-user-refresh-token-repository"
import { CreateTokensUseCase } from "../create-tokens"

export function MakeCreateTokensUseCase() {
  const userRefreshTokenRepository = new PrismaUserRefreshTokenRepository()
  const useCase = new CreateTokensUseCase(userRefreshTokenRepository)

  return useCase
}
