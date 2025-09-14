import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { MembershipRepository } from '@/repositories/membership-repository'
import { IMembershipWithUserDTO } from '@/dto/i-membership-with-user-dto'

interface GetAllGymMembershipCaseRequest {
  gymId: string
}

interface GetAllGymMembershipCaseResponse {
  membership: IMembershipWithUserDTO[]
}

export class GetAllGymMembershipUserCase {
  constructor(private membershipRepository: MembershipRepository) { }

  async execute({
    gymId,
  }: GetAllGymMembershipCaseRequest): Promise<GetAllGymMembershipCaseResponse> {
    const membership = await this.membershipRepository.findAllUsersByGymId(gymId)

    if (!membership) {
      throw new ResourceNotFoundError()
    }

    return {
      membership,
    }
  }
}
