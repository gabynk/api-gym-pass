import { Membership, Prisma, Status } from '@prisma/client'

export interface MembershipRepository {
  findByUserIdAndGymId(userId: string, gymId: string): Promise<Membership | null>
  updateStatus(userId: string, gymId: string, status: Status): Promise<void>
  create(data: Prisma.MembershipUncheckedCreateInput): Promise<Membership>
}
