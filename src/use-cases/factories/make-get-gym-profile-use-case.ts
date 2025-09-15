import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GetGymProfileUseCase } from '../get-gym-profile'

export function MakeGetGymProfileUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new GetGymProfileUseCase(gymsRepository)

  return useCase
}
