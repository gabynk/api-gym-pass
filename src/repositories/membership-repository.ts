import { Membership, Prisma } from '@prisma/client'

export interface MembershipRepository {
  findByUserIdAndGymId(userId: string, gymId: string): Promise<Membership | null>
  create(data: Prisma.MembershipUncheckedCreateInput): Promise<Membership>
}
