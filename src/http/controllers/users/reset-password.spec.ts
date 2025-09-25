import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createGymAndMembership } from '@/utils/test/create-gym-and-membership'
import { prisma } from '@/lib/prisma'

describe('Register And Send Email (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to reset password', async () => {
    const { token, user } = await createAndAuthenticateUser(app, true)
    const { gym } = await createGymAndMembership({ userId: user.id, role: 'STAFF' })

    await request(app.server)
      .post(`/gyms/${gym.id}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'new-user@example.com',
      })

    const createdUser = await prisma.user.findUnique({
      where: {
        email: 'new-user@example.com',
      },
      include: {
        refreshTokens: true
      }

    })

    const response = await request(app.server)
      .post(`/reset-password`)
      .query({ token: createdUser?.refreshTokens[0].token_hash })
      .send({ password: '1234' })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to reset password with wrong token', async () => {
    const { token, user } = await createAndAuthenticateUser(app, true)
    const { gym } = await createGymAndMembership({ userId: user.id, role: 'STAFF' })

    await request(app.server)
      .post(`/gyms/${gym.id}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'new-user-without-verify-token@example.com',
      })

    const wrongToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNWIzYjFkNC1kYjMwLTQ4YjctOTVlMC02M2M2OTMwYTVkMDkiLCJnaWQiOiI5ZGZlZTJjZi1hZGU2LTQ0NTUtODJjNS01OGRlYjQzNjQ4NzciLCJzdWIiOiI3MzgyMTQwZS04YWZlLTQ5NGMtYTE3Ni1hYmRkNTE2YmNlODgiLCJpYXQiOjE3NTg2MzM5MDIsImV4cCI6MTc1ODYzNDUwMn0.HSzYLJem6J_R2A-waDpF2EwuG26YTWmeSFidXGbePGY'

    const response = await request(app.server)
      .post(`/reset-password`)
      .query({ token: wrongToken })
      .send({ password: '1234' })

    expect(response.statusCode).toEqual(401)
  })
})
