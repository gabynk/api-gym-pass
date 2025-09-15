import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchGymCheckInsHistoryUseCaseRequest {
  gymId: string
  page: number
}

interface FetchGymCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchGymCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({
    gymId,
    page,
  }: FetchGymCheckInsHistoryUseCaseRequest): Promise<FetchGymCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByGymId(
      gymId,
      page,
    )

    return {
      checkIns,
    }
  }
}
