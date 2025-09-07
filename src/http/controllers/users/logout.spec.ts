import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Logout user',
      email: 'logout@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/session').send({
      email: 'logout@example.com',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')
    const response = await request(app.server)
      .post('/logout')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
