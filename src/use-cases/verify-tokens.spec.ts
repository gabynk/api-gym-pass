import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { InMemoryUserRefreshTokenRepository } from '@/repositories/in-memories/in-memory-user-refresh-token-repository'
import { UnauthorizedError } from './errors/unauthorized-error'
import { CreateTokensUseCase } from './create-tokens'
import { VerifyTokensUseCase } from './verify-tokens'
import { RevokeTokensUseCase } from './revoke-all-tokens'
import { randomUUID } from 'node:crypto'

let userRefreshTokenRepository: InMemoryUserRefreshTokenRepository
let userRepository: InMemoryUsersRepository
let createTokensUseCase: CreateTokensUseCase
let revokeTokensUseCase: RevokeTokensUseCase
let sut: VerifyTokensUseCase

describe('Create tokens Use Case', () => {
  beforeEach(() => {
    userRefreshTokenRepository = new InMemoryUserRefreshTokenRepository()
    userRepository = new InMemoryUsersRepository()
    createTokensUseCase = new CreateTokensUseCase(userRefreshTokenRepository)
    revokeTokensUseCase = new RevokeTokensUseCase(userRefreshTokenRepository, userRepository)
    sut = new VerifyTokensUseCase(userRefreshTokenRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to get valid tokens', async () => {
    const createdTokens = await createTokensUseCase.execute({
      refreshToken: 'token',
      userId: '123456',
      jti: randomUUID(),
    })
    const { token } = await sut.execute({
      jti: createdTokens.token.jti,
    })

    expect(token.id).toEqual(expect.any(String))
    expect(token.user_id).toEqual(createdTokens.token.user_id)
    expect(token.revoked_at).toEqual(null)
  })

  it('Should be able to error with expired token', async () => {
    const createdTokens = await createTokensUseCase.execute({
      refreshToken: 'token',
      userId: '123456',
      jti: randomUUID(),
    })

    const date = dayjs().add(8, 'days')
    vi.setSystemTime(new Date(date.toDate()))

    await expect(() =>
      sut.execute({
        jti: createdTokens.token.jti,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('Should be able to get error with revoked token', async () => {
    const actorUser = await userRepository.create({
      name: 'Admim',
      email: 'admin@example.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    })
    const targetUser = await userRepository.create({
      name: 'Member',
      email: 'member@example.com',
      password_hash: await hash('123456', 6),
      role: 'MEMBER',
    })
    const targetToken = await createTokensUseCase.execute({
      refreshToken: 'token',
      userId: targetUser.id,
      jti: randomUUID(),
    })
    const { tokens } = await revokeTokensUseCase.execute({
      actorId: actorUser.id,
      targetUserId: targetUser.id
    })

    expect(tokens[0].revoked_at).not.toEqual(null)
    await expect(
      sut.execute({ jti: targetToken.token.jti }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
