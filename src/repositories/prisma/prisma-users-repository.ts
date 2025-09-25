import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findByUserIdAndGymIdWithMembership(user_id: string, gym_id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        membershipUser: {
          where: {
            gym_id
          }
        }

      }

    })

    return user
  }

  async updatePassword(userId: string, passwordHash: string) {
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password_hash: passwordHash
      }
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
