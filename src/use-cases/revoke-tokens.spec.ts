import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTokensUseCase } from './create-tokens'
import { InMemoryUserRefreshTokenRepository } from '@/repositories/in-memories/in-memory-user-refresh-token-repository'
import { UnauthorizedError } from './errors/unauthorized-error'
import { RevokeTokensUseCase } from './revoke-tokens'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'

import { hash } from 'bcryptjs'
import { RegisterUseCase } from './register'

let userRefreshTokenRepository: InMemoryUserRefreshTokenRepository
let userRepository: InMemoryUsersRepository
let createTokensUseCase: CreateTokensUseCase
let registerUseCase: RegisterUseCase
let sut: RevokeTokensUseCase

describe('Revoke Token Use Case', () => {
  beforeEach(() => {
    userRefreshTokenRepository = new InMemoryUserRefreshTokenRepository()
    userRepository = new InMemoryUsersRepository()
    createTokensUseCase = new CreateTokensUseCase(userRefreshTokenRepository)
    registerUseCase = new RegisterUseCase(userRepository)
    sut = new RevokeTokensUseCase(userRefreshTokenRepository, userRepository)
  })

  it('Should be able to revoke tokens', async () => {
    const revokedByUser = await userRepository.create({
      name: 'Admim',
      email: 'admin@example.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })
    const revokingByUser = await userRepository.create({
      name: 'Member',
      email: 'member@example.com',
      password_hash: await hash('123456', 6),
      role: 'MEMBER',
    })
    await createTokensUseCase.execute({
      refreshToken: 'token',
      userId: revokingByUser.id,
    })
    const { tokens } = await sut.execute({
      actorId: revokedByUser.id,
      targetUserId: revokingByUser.id
    })

    expect(tokens[0].user_id).toEqual(revokingByUser.id)
    expect(tokens[0].revoked_at).not.toEqual(null)
    expect(tokens[0].revoked_by_id).toEqual(revokedByUser.id)
  })

  it('Should be able get error with nonexist request user', async () => {
    await expect(() =>
      sut.execute({
        actorId: '123456',
        targetUserId: '123456'
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('Should be able get error if request user is not admin', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
    })

    expect(user.role).toEqual('MEMBER')

    await expect(() =>
      sut.execute({
        actorId: user.id,
        targetUserId: user.id
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
