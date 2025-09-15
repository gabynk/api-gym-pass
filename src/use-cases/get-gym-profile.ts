import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetGymProfileUseCaseRequest {
  gymId: string
}

interface GetGymProfileUseCaseResponse {
  gym: Gym
}

export class GetGymProfileUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({
    gymId,
  }: GetGymProfileUseCaseRequest): Promise<GetGymProfileUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    return {
      gym,
    }
  }
}
