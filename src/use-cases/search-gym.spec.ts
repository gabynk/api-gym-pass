import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gym'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)
  })

  it('Should be able to fetch paginated gyms search', async () => {
    await gymsRepository.create({
      title: 'gym-1',
      description: null,
      phone: null,
      latitude: -22.2147713,
      longitude: -49.9550626,
    })
    await gymsRepository.create({
      title: 'gym-2',
      description: null,
      phone: null,
      latitude: -22.2147713,
      longitude: -49.9550626,
    })

    const { gyms } = await sut.execute({
      query: 'gym-1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym-1' })])
  })

  it('Should be able to fetch paginated gyms search page 2', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-test-${i}`,
        description: null,
        phone: null,
        latitude: -22.2147713,
        longitude: -49.9550626,
      })
    }

    const { gyms } = await sut.execute({
      query: 'gym-test',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-test-21' }),
      expect.objectContaining({ title: 'gym-test-22' }),
    ])
  })
})
