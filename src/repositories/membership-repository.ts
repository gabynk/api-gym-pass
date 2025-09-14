import { IMembershipWithUserDTO } from '@/dto/i-membership-with-user-dto'
import { Membership, Prisma, Status } from '@prisma/client'

export interface MembershipRepository {
  findAllUsersByGymId(gymId: string): Promise<IMembershipWithUserDTO[] | null>
  findByUserIdAndGymId(userId: string, gymId: string): Promise<Membership | null>
  updateStatus(userId: string, gymId: string, status: Status): Promise<void>
  create(data: Prisma.MembershipUncheckedCreateInput): Promise<Membership>
}
