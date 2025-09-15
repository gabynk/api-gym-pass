import { MakeGetGymProfileUseCase } from '@/use-cases/factories/make-get-gym-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const getProfileParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { gymId } = getProfileParamsSchema.parse(request.params)

  const getGymProfileUseCase = MakeGetGymProfileUseCase()

  const { gym } = await getGymProfileUseCase.execute({
    gymId
  })

  return reply.status(200).send({
    gym
  })
}
