import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { MembershipRepository } from '../membership-repository'

export class PrismaMembershipRepository implements MembershipRepository {
  async findByUserIdAndGymId(user_id: string, gym_id: string) {
    const gym = await prisma.membership.findFirst({
      where: {
        user_id,
        gym_id
      }
    })
    return gym
  }

  async create(data: Prisma.MembershipUncheckedCreateInput) {
    const gym = await prisma.membership.create({
      data,
    })
    return gym
  }
}
