import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { MakeRevokeTokensUseCase } from '@/use-cases/factories/make-revoke-tokens-use-case'

export async function revoke(request: FastifyRequest, reply: FastifyReply) {
  const revokeQuerySchema = z.object({
    userId: z.coerce.string(),
  })

  try {
    const { userId } = revokeQuerySchema.parse(request.params)
    const sub = request.user.sub

    const revokeTokensUseCase = MakeRevokeTokensUseCase()
    await revokeTokensUseCase.execute({
      actorId: sub,
      targetUserId: userId
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return reply.status(401).send({
        message: err.message,
      })
    }

    throw err
  }
}
