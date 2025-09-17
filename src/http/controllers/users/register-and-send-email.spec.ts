import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createGymAndMembership } from '@/utils/test/create-gym-and-membership'

describe('Register And Send Email (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const { token, user } = await createAndAuthenticateUser(app, true)
    const { gym } = await createGymAndMembership({ userId: user.id, role: 'STAFF' })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'new-user@example.com',
      })

    expect(response.statusCode).toEqual(201)
  })
})
