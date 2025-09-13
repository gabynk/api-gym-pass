import { prisma } from '@/lib/prisma'

interface createGymAndMembershipProps {
  userId: string,
  status?: "ACTIVE" | "INACTIVE" | "INVITED",
  latlong?: {
    latitude: number,
    longitude: number,
  }
}

export async function createGymAndMembership({
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

  const membership = await prisma.membership.create({
    data: {
      status,
      user_id: userId,
      gym_id: gym.id,
      created_by_id: userId,
    },
  })

  return {
    gym,
    membership,
  }
}
