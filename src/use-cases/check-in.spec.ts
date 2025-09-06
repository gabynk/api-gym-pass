import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memories/in-memory-check-ins-repository'
import { CheckInUserCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryMembershipRepository } from '@/repositories/in-memories/in-memory-membership-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'

let userRepository: InMemoryUsersRepository
let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let membershipRepository: InMemoryMembershipRepository
let sut: CheckInUserCase

describe('Check in Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    membershipRepository = new InMemoryMembershipRepository()
    sut = new CheckInUserCase(checkInsRepository, gymsRepository, membershipRepository)

    await gymsRepository.create({
      id: 'gym-id',
      title: 'gym-test',
      description: null,
      phone: null,
      latitude: -22.2147713,
      longitude: -49.9550626,
      created_by_id: 'user-id'
    })

    await userRepository.items.push({
      id: 'user-id',
      name: 'user name',
      email: 'user@test.com',
      password_hash: 'passwordhash',
      created_at: new Date(),
      role: 'USER',
      email_verified_at: new Date(),
    })

    await membershipRepository.items.push({
      id: 'membership-id',
      status: 'ACTIVE',
      user_id: 'user-id',
      gym_id: 'gym-id',
      created_at: new Date(),
      created_by_id: 'user-id-2',
      left_at: null,
      role: 'MEMBER'
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -22.2147713,
      userLongitude: -49.9550626,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -22.2147713,
      userLongitude: -49.9550626,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: -22.2147713,
        userLongitude: -49.9550626,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('Should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -22.2147713,
      userLongitude: -49.9550626,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -22.2147713,
      userLongitude: -49.9550626,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id',
      title: 'gym-test',
      description: '',
      phone: '',
      latitude: new Decimal(-22.2145721),
      longitude: new Decimal(-49.6668565),
      created_by_id: 'user-id'
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: -22.1044292,
        userLongitude: -50.1771939,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
