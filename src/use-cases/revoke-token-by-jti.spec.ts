import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRefreshTokenRepository } from '@/repositories/in-memories/in-memory-user-refresh-token-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CreateTokensUseCase } from './create-tokens'
import { RevokeTokenByJtiUseCase } from './revoke-token-by-jti'

let userRefreshTokenRepository: InMemoryUserRefreshTokenRepository
let userRepository: InMemoryUsersRepository
let createTokensUseCase: CreateTokensUseCase
let sut: RevokeTokenByJtiUseCase

describe('Revoke Token By Jti Use Case', () => {
  beforeEach(() => {
    userRefreshTokenRepository = new InMemoryUserRefreshTokenRepository()
    userRepository = new InMemoryUsersRepository()
    createTokensUseCase = new CreateTokensUseCase(userRefreshTokenRepository)
    sut = new RevokeTokenByJtiUseCase(userRefreshTokenRepository, userRepository)
  })

  it('Should be able to revoke by jti', async () => {
    const user = await userRepository.create({
      name: 'Member',
      email: 'member@example.com',
      password_hash: await hash('123456', 6),
      role: 'MEMBER',
    })
    const createdToken = await createTokensUseCase.execute({
      refreshToken: 'token',
      userId: user.id,
      jti: randomUUID(),
    })
    const { token } = await sut.execute({
      userId: user.id,
      jti: createdToken.token.jti
    })

    expect(token?.user_id).toEqual(user.id)
    expect(token?.revoked_at).not.toEqual(null)
    expect(token?.revoked_by_id).toEqual(user.id)
  })

  it('Should be able get error with nonexist request user', async () => {
    await expect(() =>
      sut.execute({
        userId: '123456',
        jti: '123456'
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
