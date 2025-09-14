import { beforeEach, describe, expect, it } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { InMemoryMembershipRepository } from '@/repositories/in-memories/in-memory-membership-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { GetAllGymMembershipUserCase } from './get-all-gym-membership'

let gymsRepository: InMemoryGymsRepository
let userRepository: InMemoryUsersRepository
let membershipRepository: InMemoryMembershipRepository
let sut: GetAllGymMembershipUserCase

describe('Get All Gym Membership Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    userRepository = new InMemoryUsersRepository()
    membershipRepository = new InMemoryMembershipRepository()
    sut = new GetAllGymMembershipUserCase(membershipRepository)

    gymsRepository.items.push({
      id: 'gym-id-with-user',
      title: 'gym-test',
      description: '',
      phone: '',
      latitude: new Decimal(-22.220367),
      longitude: new Decimal(-49.9489532),
      created_by_id: 'user-id'
    })

    userRepository.items.push({
      id: 'user-id',
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
      user_id: 'user-id',
      gym_id: 'gym-id-with-user',
      created_at: new Date(),
      created_by_id: 'user-id',
      left_at: null,
      role: 'MEMBER'
    })
  })

  it('Should be able to get all user membership', async () => {
    const { membership } = await sut.execute({
      gymId: 'gym-id-with-user',
    })

    expect(membership.length).toEqual(1)
    expect(membership[0].id).toEqual(expect.any(String))
    expect(membership[0].role).toEqual('MEMBER')
    expect(membership[0]?.user).toEqual(
      expect.objectContaining({
        id: 'user-id',
      }),
    )
  })
})
