import { GlobalRole, Membership, Prisma, Status } from '@prisma/client'
import { MembershipRepository } from '../membership-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryMembershipRepository implements MembershipRepository {
  public items: Membership[] = []

  async findAllUsersByGymId(gymId: string) {
    const membership = this.items.filter((item) => item.gym_id === gymId)

    if (!membership.length) {
      return null
    }

    if (gymId === 'gym-id-with-user') {
      return [{
        ...membership[0],
        user: {
          id: 'user-id',
          name: 'User name',
          email: 'user@test.com',
          role: GlobalRole.USER,
          created_at: new Date(),
          email_verified_at: null
        }
      }]
    }

    return null
  }

  async findByUserIdAndGymId(userId: string, gymId: string) {
    const membership = this.items.find((item) => item.user_id === userId && item.gym_id === gymId)

    if (!membership) {
      return null
    }

    return membership
  }

  async updateStatus(userId: string, gymId: string, status: Status) {
    const membershipIndex = this.items.findIndex((item) => item.user_id === userId && item.gym_id === gymId)
    if (membershipIndex >= 0) {
      this.items[membershipIndex].status = status
    }
  }

  async create(data: Prisma.MembershipUncheckedCreateInput) {
    const membership = {
      id: data.id ?? randomUUID(),
      status: data.status,
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      created_by_id: data.created_by_id,
      left_at: null,
      role: data?.role ?? 'MEMBER'
    }

    this.items.push(membership)

    return membership
  }
}
