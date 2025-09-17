import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { Membership, User } from '@prisma/client'
import { MembershipRepository } from '@/repositories/membership-repository'

interface RegisterUserByGymUseCaseRequest {
  name: string
  email: string
  gymId: string
  authorId: string
}

interface RegisterUserByGymUseCaseResponse {
  user: User
  membership: Membership
}

export class RegisterUserByGymUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private membershipRepository: MembershipRepository
  ) { }

  async execute({
    name,
    email,
    gymId,
    authorId,
  }: RegisterUserByGymUseCaseRequest): Promise<RegisterUserByGymUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
    })

    const membership = await this.membershipRepository.create({
      status: 'INVITED',
      user_id: user.id,
      gym_id: gymId,
      created_by_id: authorId,
    })

    return {
      user,
      membership,
    }
  }
}
