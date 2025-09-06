import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { CreateMembershipUseCase } from './create-membership'
import { InMemoryMembershipRepository } from '@/repositories/in-memories/in-memory-membership-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: InMemoryGymsRepository
let userRepository: InMemoryUsersRepository
let membershipRepository: InMemoryMembershipRepository
let sut: CreateMembershipUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    userRepository = new InMemoryUsersRepository()
    membershipRepository = new InMemoryMembershipRepository()
    sut = new CreateMembershipUseCase(userRepository, gymsRepository, membershipRepository)

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'gym-test',
      description: '',
      phone: '',
      latitude: new Decimal(-22.2145721),
      longitude: new Decimal(-49.6668565),
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
  })

  it('Should be able to create gym', async () => {
    const { membership } = await sut.execute({
      userId: 'user-id',
      status: 'ACTIVE',
      gymId: 'gym-id',
      createdById: 'user-id2',
    })

    expect(membership.id).toEqual(expect.any(String))
    expect(membership).toEqual(expect.objectContaining({
      role: 'MEMBER',
    }))
    expect(membership.user_id).toEqual('user-id')
  })
})
