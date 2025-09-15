import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { GetGymProfileUseCase } from './get-gym-profile'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: InMemoryGymsRepository
let sut: GetGymProfileUseCase

describe('Get Gym Profile Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GetGymProfileUseCase(gymsRepository)

    gymsRepository.items.push({
      id: 'gym-id',
      title: 'gym-test',
      description: '',
      phone: '',
      latitude: new Decimal(-22.220367),
      longitude: new Decimal(-49.9489532),
      created_by_id: 'user-id'
    })
  })

  it('Should be able to get gym profile', async () => {
    const { gym } = await sut.execute({ gymId: 'gym-id' })

    expect(gym.id).toEqual(expect.any(String))
  })
})
