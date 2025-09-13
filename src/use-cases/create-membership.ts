import { Membership } from '@prisma/client'
import { MembershipRepository } from '@/repositories/membership-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'

interface CreateMembershipUseCaseRequest {
  userId: string
  status: 'ACTIVE' | 'INACTIVE' | 'INVITED'
  gymId: string
  createdById: string
}

interface CreateMembershipUseCaseResponse {
  membership: Membership
}

export class CreateMembershipUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private gymsRepository: GymsRepository,
    private membershipRepository: MembershipRepository) { }

  async execute({
    userId,
    status,
    gymId,
    createdById,
  }: CreateMembershipUseCaseRequest): Promise<CreateMembershipUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const membership = await this.membershipRepository.create({
      status,
      user_id: user.id,
      gym_id: gym.id,
      created_by_id: createdById,
    })

    return {
      membership,
    }
  }
}
