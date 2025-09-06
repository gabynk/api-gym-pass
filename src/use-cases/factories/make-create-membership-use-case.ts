import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateMembershipUseCase } from '../create-membership'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'

export function MakeCreateMembershipUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const gymsRepository = new PrismaGymsRepository()
  const membershipRepository = new PrismaMembershipRepository()
  const useCase = new CreateMembershipUseCase(usersRepository, gymsRepository, membershipRepository)

  return useCase
}
