import { PrismaUserRefreshTokenRepository } from "@/repositories/prisma/prisma-user-refresh-token-repository"
import { VerifyTokensUseCase } from "../verify-tokens"

export function MakeVerifyTokensUseCase() {
  const userRefreshTokenRepository = new PrismaUserRefreshTokenRepository()
  const useCase = new VerifyTokensUseCase(userRefreshTokenRepository)

  return useCase
}
