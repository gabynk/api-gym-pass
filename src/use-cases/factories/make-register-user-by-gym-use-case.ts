import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'
import { RegisterUserByGymUseCase } from '../register-user-by-gym'

export function MakeRegisterUserByGymUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const membershipRepository = new PrismaMembershipRepository()
  const useCase = new RegisterUserByGymUseCase(usersRepository, membershipRepository)

  return useCase
}
