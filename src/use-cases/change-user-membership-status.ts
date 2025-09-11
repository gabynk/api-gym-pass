import { Status } from '@prisma/client'
import { MembershipRepository } from '@/repositories/membership-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'

interface ChangeUserMembershipStatusUseCaseRequest {
  userId: string
  gymId: string
  status: Status
}

export class ChangeUserMembershipStatusUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private gymsRepository: GymsRepository,
    private membershipRepository: MembershipRepository) { }

  async execute({
    userId,
    gymId,
    status
  }: ChangeUserMembershipStatusUseCaseRequest) {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    await this.membershipRepository.updateStatus(userId, gymId, status)
  }
}
