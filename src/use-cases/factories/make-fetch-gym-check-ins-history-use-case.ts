import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchGymCheckInsHistoryUseCase } from '../fetch-gym-check-ins-history'

export function MakeFetchGymCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchGymCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}
