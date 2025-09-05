import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Revoke token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to revoke user token', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const revokingUser = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .patch(`/admin/users/${revokingUser.user.id}/revoke`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
