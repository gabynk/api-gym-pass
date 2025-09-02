import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import dayjs from 'dayjs'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    vi.useFakeTimers()
  })

  afterAll(async () => {
    await app.close()
    vi.useRealTimers()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'Revoked user to refreshJohn Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/session').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')
    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })

  it('should not be able to refresh a token with expired token', async () => {
    await request(app.server).post('/users').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/session').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const date = dayjs().add(8, 'days')
    vi.setSystemTime(new Date(date.toDate()))

    const cookies = authResponse.get('Set-Cookie')
    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual({
      message: "Request token not found",
    })
  })

  it('should not be able to refresh a token with revoked token', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server).post('/users').send({
      name: 'Revoked user to refresh',
      email: 'revoked_user@example.com',
      password: '123456',
    })

    const revokedAuthResponse = await request(app.server).post('/session').send({
      email: 'revoked_user@example.com',
      password: '123456',
    })

    const revokedUserResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${revokedAuthResponse.body.token}`)
      .send()

    await request(app.server)
      .patch(`/admin/users/${revokedUserResponse.body.user.id}/revoke`)
      .set('Authorization', `Bearer ${token}`)
      .send()


    const cookies = revokedAuthResponse.get('Set-Cookie')
    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual({
      message: "Unauthorized.",
    })
  })
})
