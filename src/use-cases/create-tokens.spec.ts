import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTokensUseCase } from './create-tokens'
import { InMemoryUserRefreshTokenRepository } from '@/repositories/in-memories/in-memory-user-refresh-token-repository'
import { randomUUID } from 'node:crypto'

let userRefreshTokenRepository: InMemoryUserRefreshTokenRepository
let sut: CreateTokensUseCase

describe('Create tokens Use Case', () => {
  beforeEach(() => {
    userRefreshTokenRepository = new InMemoryUserRefreshTokenRepository()
    sut = new CreateTokensUseCase(userRefreshTokenRepository)
  })

  it('Should be able to authenticate', async () => {
    const { token } = await sut.execute({
      refreshToken: 'token',
      userId: '123456',
      jti: randomUUID(),
    })

    expect(token.id).toEqual(expect.any(String))
  })
})
