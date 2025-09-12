import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { InMemoryMembershipRepository } from '@/repositories/in-memories/in-memory-membership-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { GetUserMembershipUserCase } from './get-user-membership'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let gymsRepository: InMemoryGymsRepository
let userRepository: InMemoryUsersRepository
let membershipRepository: InMemoryMembershipRepository
let sut: GetUserMembershipUserCase

describe('Change User Membership Status Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    userRepository = new InMemoryUsersRepository()
    membershipRepository = new InMemoryMembershipRepository()
    sut = new GetUserMembershipUserCase(userRepository)

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'gym-test',
      description: '',
      phone: '',
      latitude: new Decimal(-22.220367),
      longitude: new Decimal(-49.9489532),
      created_by_id: 'user-id-with-membership'
    })

    userRepository.items.push({
      id: 'user-id-with-membership',
      name: 'user name',
      email: 'user@test.com',
      password_hash: 'passwordhash',
      created_at: new Date(),
      role: 'USER',
      email_verified_at: new Date(),
    })

    membershipRepository.items.push({
      id: 'membership-id',
      status: 'ACTIVE',
      user_id: 'user-id-with-membership',
      gym_id: 'gym-id',
      created_at: new Date(),
      created_by_id: 'user-id-with-membership',
      left_at: null,
      role: 'MEMBER'
    })
  })

  it('Should be able to get user membership', async () => {
    const { userMembership } = await sut.execute({
      userId: 'user-id-with-membership',
      gymId: 'gym-id',
    })


    expect(userMembership.id).toEqual(expect.any(String))
    expect(userMembership.membershipUser[0].status).toEqual('ACTIVE')
  })

  it('Should not be able to change user membership status if user does not have membership', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
