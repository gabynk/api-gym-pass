import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'
import { IMembershipWithUserDTO } from '@/dto/IMembershipWithUserDTO'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

interface GetUserMembershipCaseRequest {
  userId: string
  gymId: string
}

interface GetUserMembershipCaseResponse {
  userMembership: IMembershipWithUserDTO
}

export class GetUserMembershipUserCase {
  constructor(private usersRepository: PrismaUsersRepository) { }

  async execute({
    userId,
    gymId,
  }: GetUserMembershipCaseRequest): Promise<GetUserMembershipCaseResponse> {
    const userMembership = await this.usersRepository.findByUserIdAndGymIdWithMembership(userId, gymId)

    if (!userMembership) {
      throw new ResourceNotFoundError()
    }

    return {
      userMembership,
    }
  }
}
