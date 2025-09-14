import { Prisma, Status } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { MembershipRepository } from '../membership-repository'

export class PrismaMembershipRepository implements MembershipRepository {
  async findAllUsersByGymId(gym_id: string) {
    const membership = await prisma.membership.findMany({
      where: {
        gym_id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
            email_verified_at: true,
          }
        }
      }
    })

    return membership
  }

  async findByUserIdAndGymId(user_id: string, gym_id: string) {
    const membership = await prisma.membership.findFirst({
      where: {
        user_id,
        gym_id
      }
    })
    return membership
  }

  async updateStatus(user_id: string, gym_id: string, status: Status) {
    await prisma.membership.update({
      where: {
        user_id_gym_id: { user_id, gym_id },
      },
      data: {
        status
      }
    })
  }

  async create(data: Prisma.MembershipUncheckedCreateInput) {
    const membership = await prisma.membership.create({
      data,
    })
    return membership
  }
}
