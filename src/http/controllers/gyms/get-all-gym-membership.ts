import { MakeGetAllGymMembershipUseCase } from '@/use-cases/factories/make-get-all-gym-membership-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getAllGymMembership(request: FastifyRequest, reply: FastifyReply) {
  const getAllGymMembershipParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { gymId } = getAllGymMembershipParamsSchema.parse(request.params)

  const getAllGymMembershipUseCase = MakeGetAllGymMembershipUseCase()

  const { membership } = await getAllGymMembershipUseCase.execute({
    gymId,
  })

  return reply.status(200).send({
    membership
  })
}
