import { GymRole, Prisma, Status, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findByUserIdAndGymIdWithMembership(id: string, gym_id: string) {
    const user = this.items.find((user) => user.id === id)

    if (!user) {
      return null
    }

    if (id === 'user-id-with-membership') {
      return {
        ...user,
        membershipUser: [{
          id: 'membership-id',
          status: Status.ACTIVE,
          user_id: 'user-id',
          gym_id,
          created_at: new Date(),
          created_by_id: 'user-id',
          left_at: null,
          role: GymRole.MEMBER,
        }]
      }
    }

    return {
      ...user,
      membershipUser: []
    }
  }

  async updatePassword(userId: string, password_hash: string) {
    const userIndex = this.items.findIndex(item => item.id === userId)

    let user = null
    if (userIndex >= 0) {
      this.items[userIndex].password_hash = password_hash
      this.items[userIndex].email_verified_at = new Date()
      user = this.items[userIndex]
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data?.password_hash || null,
      created_at: new Date(),
      role: data?.role || 'USER',
      email_verified_at: data.email_verified_at ? new Date(data.email_verified_at) : null,
    }

    this.items.push(user)

    return user
  }
}
