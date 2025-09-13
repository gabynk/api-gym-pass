import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Change User Membership Status (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to change user membership status', async () => {
    const { token, user } = await createAndAuthenticateUser(app, true)

    const gym = await prisma.gym.create({
      data: {
        title: 'gym-test',
        latitude: -22.2147713,
        longitude: -49.9550626,
        created_by_id: user.id
      },
    })

    await request(app.server)
      .post(`/gyms/${gym.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user.id,
        status: 'ACTIVE',
      })

    const response = await request(app.server)
      .patch(`/gyms/${gym.id}/members/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user.id,
        status: 'INACTIVE',
      })

    expect(response.statusCode).toEqual(204)
  })

  it('should not be able to change user membership status if author does not permission', async () => {
    const { token, user } = await createAndAuthenticateUser(app, false)

    const gym = await prisma.gym.create({
      data: {
        title: 'gym-test',
        latitude: -22.2147713,
        longitude: -49.9550626,
        created_by_id: user.id
      },
    })

    await prisma.membership.create({
      data: {
        created_by_id: user.id,
        user_id: user.id,
        status: 'ACTIVE',
        gym_id: gym.id,
      },
    })

    const response = await request(app.server)
      .patch(`/gyms/${gym.id}/members/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user.id,
        status: 'INACTIVE',
      })

    expect(response.statusCode).toEqual(403)
  })
})
