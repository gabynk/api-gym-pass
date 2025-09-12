import { IMembershipWithUserDTO } from '@/dto/i-membership-with-user-dto'
import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUserIdAndGymIdWithMembership(userId: string, gymId: string): Promise<IMembershipWithUserDTO | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
