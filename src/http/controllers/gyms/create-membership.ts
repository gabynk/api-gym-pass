import { MakeCreateMembershipUseCase } from '@/use-cases/factories/make-create-membership-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createMembership(request: FastifyRequest, reply: FastifyReply) {
  const createMembershipParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createMembershipBodySchema = z.object({
    userId: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE", "INVITED"])
  })

  const { gymId } = createMembershipParamsSchema.parse(request.params)
  const { userId, status } = createMembershipBodySchema.parse(request.body)

  const createMembershipUseCase = MakeCreateMembershipUseCase()

  await createMembershipUseCase.execute({
    createdById: request.user.sub,
    userId,
    status,
    gymId,
  })

  return reply.status(201).send()
}
