import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUserCase } from '../authenticate'

export function MakeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const userCase = new AuthenticateUserCase(usersRepository)

  return userCase
}
