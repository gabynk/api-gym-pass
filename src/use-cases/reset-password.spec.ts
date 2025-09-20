import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { ResetPasswordUseCase } from './reset-password'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let sut: ResetPasswordUseCase

describe('Reset Password Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new ResetPasswordUseCase(userRepository)

    userRepository.items.push({
      id: 'user-id',
      name: 'user name',
      email: 'user@test.com',
      password_hash: null,
      created_at: new Date(),
      role: 'USER',
      email_verified_at: null,
    })
  })

  it('Should be able to reset password', async () => {
    const userId = userRepository.items[0].id
    await sut.execute({
      password: 'John Doe',
      userId
    })

    expect(userRepository.items[0].id).toEqual(expect.any(String))
    expect(userRepository.items[0].email_verified_at).not.toEqual(null)
  })

  it('Should not be able to create password if not have user id', async () => {
    await expect(() =>
      sut.execute({
        password: 'John Doe',
        userId: 'nonexists-id'
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
