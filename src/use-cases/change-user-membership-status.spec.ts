import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { InMemoryMembershipRepository } from '@/repositories/in-memories/in-memory-membership-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ChangeUserMembershipStatusUseCase } from './change-user-membership-status'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let gymsRepository: InMemoryGymsRepository
let userRepository: InMemoryUsersRepository
let membershipRepository: InMemoryMembershipRepository
let sut: ChangeUserMembershipStatusUseCase

describe('Change User Membership Status Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    userRepository = new InMemoryUsersRepository()
    membershipRepository = new InMemoryMembershipRepository()
    sut = new ChangeUserMembershipStatusUseCase(userRepository, gymsRepository, membershipRepository)

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

  it('Should be able to change user membership status', async () => {
    await sut.execute({
      userId: 'user-id-with-membership',
      gymId: 'gym-id',
      status: 'INACTIVE'
    })

    expect(membershipRepository.items[0].id).toEqual(expect.any(String))
    expect(membershipRepository.items[0].status).toEqual('INACTIVE')
  })

  it('Should not be able to change user membership status if user does not have membership', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        status: 'INACTIVE'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    expect(membershipRepository.items[0].id).toEqual(expect.any(String))
    expect(membershipRepository.items[0].status).not.toEqual('INACTIVE')
  })
})
