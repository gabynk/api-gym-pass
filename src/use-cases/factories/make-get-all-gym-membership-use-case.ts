import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'
import { GetAllGymMembershipUserCase } from '../get-all-gym-membership'

export function MakeGetAllGymMembershipUseCase() {
  const membershipRepository = new PrismaMembershipRepository()
  const useCase = new GetAllGymMembershipUserCase(membershipRepository)

  return useCase
}
