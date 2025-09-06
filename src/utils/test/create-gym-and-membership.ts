import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface createGymAndMembershipProps {
  app: FastifyInstance,
  token: string,
  userId: string,
  status?: "ACTIVE" | "INACTIVE" | "INVITED",
  latlong?: {
    latitude: number,
    longitude: number,
  }
}

export async function createGymAndMembership({
  app,
  token,
  userId,
  status = 'ACTIVE',
  latlong = {
    latitude: -22.220367,
    longitude: -49.9489532,
  }
}: createGymAndMembershipProps) {
  const gym = await prisma.gym.create({
    data: {
      title: 'gym-test',
      latitude: latlong.latitude,
      longitude: latlong.longitude,
      created_by_id: userId
    },
  })

  await request(app.server)
    .post(`/gyms/${gym.id}/members`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      userId: userId,
      status
    })

  return {
    gym,
  }
}
