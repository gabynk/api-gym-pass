import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserMembershipUserCase } from '../get-user-membership'

export function MakeGetUserMembershipUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserMembershipUserCase(usersRepository)

  return useCase
}
