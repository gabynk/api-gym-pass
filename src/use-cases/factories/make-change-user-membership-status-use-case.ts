import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'
import { ChangeUserMembershipStatusUseCase } from '../change-user-membership-status'

export function MakeChangeUserMembershipStatusUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const gymsRepository = new PrismaGymsRepository()
  const membershipRepository = new PrismaMembershipRepository()
  const useCase = new ChangeUserMembershipStatusUseCase(usersRepository, gymsRepository, membershipRepository)

  return useCase
}
