import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createGymAndMembership } from '@/utils/test/create-gym-and-membership'

describe('Get Gym Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get gym profile', async () => {
    const { token, user } = await createAndAuthenticateUser(app, true)
    const { gym } = await createGymAndMembership({ userId: user.id })

    const response = await request(app.server)
      .get(`/gym/${gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
  })
})
