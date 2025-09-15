import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memories/in-memory-check-ins-repository'
import { FetchGymCheckInsHistoryUseCase } from './fetch-gym-check-ins-history'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { InMemoryMembershipRepository } from '@/repositories/in-memories/in-memory-membership-repository'

let gymsRepository: InMemoryGymsRepository
let userRepository: InMemoryUsersRepository
let membershipRepository: InMemoryMembershipRepository
let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchGymCheckInsHistoryUseCase

describe('Fetch Gym Check-in History Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    userRepository = new InMemoryUsersRepository()
    membershipRepository = new InMemoryMembershipRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchGymCheckInsHistoryUseCase(checkInsRepository)

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

  it('Should be able to fetch check-ins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-id-with-user',
      user_id: 'user-id',
    })

    const { checkIns } = await sut.execute({
      gymId: 'gym-id-with-user',
      page: 1,
    })

    expect(checkIns).toHaveLength(1)
    expect(checkIns).toEqual([
      expect.objectContaining({ user_id: 'user-id' }),
    ])
  })
})
