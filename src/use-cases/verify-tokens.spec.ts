import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateTokensUseCase } from './create-tokens'
import { InMemoryUserRefreshTokenRepository } from '@/repositories/in-memories/in-memory-user-refresh-token-repository'
import { VerifyTokensUseCase } from './verify-tokens'
import dayjs from 'dayjs'
import { UnauthorizedError } from './errors/unauthorized-error'

let userRefreshTokenRepository: InMemoryUserRefreshTokenRepository
let createTokensUseCase: CreateTokensUseCase
let sut: VerifyTokensUseCase

describe('Create tokens Use Case', () => {
  beforeEach(() => {
    userRefreshTokenRepository = new InMemoryUserRefreshTokenRepository()
    createTokensUseCase = new CreateTokensUseCase(userRefreshTokenRepository)
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
})
