import { MakeFetchGymCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-gym-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function gymHistory(request: FastifyRequest, reply: FastifyReply) {
  const gymGistoryParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const gymHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { gymId } = gymGistoryParamsSchema.parse(request.params)
  const { page } = gymHistoryQuerySchema.parse(request.query)

  const fetchGymCheckInsHistoryUseCase = MakeFetchGymCheckInsHistoryUseCase()

  const { checkIns } = await fetchGymCheckInsHistoryUseCase.execute({
    gymId,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
