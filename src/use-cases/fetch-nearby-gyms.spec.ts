import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'near gym',
      description: null,
      phone: null,
      latitude: -22.2147713,
      longitude: -49.9550626,
      created_by_id: 'user-id'
    })
    await gymsRepository.create({
      title: 'far gym',
      description: null,
      phone: null,
      latitude: -22.9147713,
      longitude: -49.9550626,
      created_by_id: 'user-id'
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.2147713,
      userLongitude: -49.9550626,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'near gym' })])
  })
})
