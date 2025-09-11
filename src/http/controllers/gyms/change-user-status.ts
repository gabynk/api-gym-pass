import { MakeChangeUserMembershipStatusUseCase } from '@/use-cases/factories/make-change-user-membership-status-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function changeUserStatus(request: FastifyRequest, reply: FastifyReply) {
  const createMembershipParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createMembershipBodySchema = z.object({
    userId: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE", "INVITED"])
  })

  const { gymId } = createMembershipParamsSchema.parse(request.params)
  const { userId, status } = createMembershipBodySchema.parse(request.body)

  const changeUserMembershipStatusUseCase = MakeChangeUserMembershipStatusUseCase()

  await changeUserMembershipStatusUseCase.execute({
    userId,
    gymId,
    status,
  })

  return reply.status(204).send()
}
