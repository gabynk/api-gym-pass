import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { IUserWithMembershipDTO } from '@/dto/i-membership-with-user-dto'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

interface GetUserMembershipCaseRequest {
  userId: string
  gymId: string
}

interface GetUserMembershipCaseResponse {
  userMembership: IUserWithMembershipDTO
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
