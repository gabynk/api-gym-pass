import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ResetPasswordUseCaseRequest {
  userId: string
  password: string
}

export class ResetPasswordUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    password,
  }: ResetPasswordUseCaseRequest) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.updatePassword(userId, password_hash)
  }
}
