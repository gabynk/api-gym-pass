import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createGymAndMembership } from '@/utils/test/create-gym-and-membership'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create gym', async () => {
    const { token, user } = await createAndAuthenticateUser(app, true)
    const { gym, membership } = await createGymAndMembership({ userId: user.id })

    const response = await request(app.server)
      .get(`/gyms/${gym.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.membership[0].user).toEqual(
      expect.objectContaining({
        id: user.id,
      }),
    )
    expect(response.body.membership[0].id).toEqual(membership.id)
  })
})
