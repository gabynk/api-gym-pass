import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('Should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'gym-test',
      description: null,
      phone: null,
      latitude: -22.2147713,
      longitude: -49.9550626,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
