import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUserCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUserCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserCase(userRepository)
  })

  it('Should be able to authenticate', async () => {
    userRepository.items.push({
      id: 'user-id',
      name: 'user name',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
      role: 'USER',
      email_verified_at: new Date(),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    userRepository.items.push({
      id: 'user-id',
      name: 'user name',
      email: 'johndoe@example.com',
      password_hash: await hash('passwordhash', 6),
      created_at: new Date(),
      role: 'USER',
      email_verified_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
