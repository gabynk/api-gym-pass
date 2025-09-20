import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ResetPasswordUseCase } from '../reset-password'

export function MakeResetPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new ResetPasswordUseCase(usersRepository)

  return useCase
}
