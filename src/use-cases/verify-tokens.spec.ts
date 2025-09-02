import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { InMemoryUserRefreshTokenRepository } from '@/repositories/in-memories/in-memory-user-refresh-token-repository'
import { UnauthorizedError } from './errors/unauthorized-error'
import { CreateTokensUseCase } from './create-tokens'
import { VerifyTokensUseCase } from './verify-tokens'
import { RevokeTokensUseCase } from './revoke-tokens'

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
    })
    const { tokens } = await sut.execute({
      userId: createdTokens.tokens.user_id,
    })

    expect(tokens[0].id).toEqual(expect.any(String))
    expect(tokens[0].user_id).toEqual(createdTokens.tokens.user_id)
    expect(tokens[0].revoked_at).toEqual(null)
  })

  it('Should be able to error with expired token', async () => {
    const createdTokens = await createTokensUseCase.execute({
      refreshToken: 'token',
      userId: '123456',
    })

    const date = dayjs().add(8, 'days')
    vi.setSystemTime(new Date(date.toDate()))

    await expect(() =>
      sut.execute({
        userId: createdTokens.tokens.user_id,
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
    await createTokensUseCase.execute({
      refreshToken: 'token',
      userId: targetUser.id,
    })
    const { tokens } = await revokeTokensUseCase.execute({
      actorId: actorUser.id,
      targetUserId: targetUser.id
    })

    expect(tokens[0].revoked_at).not.toEqual(null)
    await expect(
      sut.execute({ userId: targetUser.id }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
