import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import { createGymAndMembership } from '@/utils/test/create-gym-and-membership'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate check-in', async () => {
    const { token, user: authUser } = await createAndAuthenticateUser(app, true)
    const latlong = {
      latitude: -22.2147713,
      longitude: -49.9550626,
    }
    const { gym } = await createGymAndMembership({ app, token, userId: authUser.id, latlong })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: authUser.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
