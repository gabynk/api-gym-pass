import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUserCase } from '../check-in'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'

export function MakeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const membershipRepository = new PrismaMembershipRepository()
  const useCase = new CheckInUserCase(checkInsRepository, gymsRepository, membershipRepository)

  return useCase
}
