import { z } from 'zod'
import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { MakeCreateTokensUseCase } from '@/use-cases/factories/make-create-tokens-use-case'
import { MakeRegisterUserByGymUseCase } from '@/use-cases/factories/make-register-user-by-gym-use-case'
import { MakeSendInviteAccessEmailUseCase } from '@/use-cases/factories/make-send-invite-access-email-use-case'

export async function registerAndSendEmail(request: FastifyRequest, reply: FastifyReply) {
  const createMembershipParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
  })

  const { gymId } = createMembershipParamsSchema.parse(request.params)
  const { name, email } = registerBodySchema.parse(request.body)

  try {
    const registerUserByGymUseCase = MakeRegisterUserByGymUseCase()
    const createdUser = await registerUserByGymUseCase.execute({
      name,
      email,
      gymId,
      authorId: request.user.sub,
    })

    const token = randomUUID()

    const createTokenUserCase = MakeCreateTokensUseCase()
    await createTokenUserCase.execute({
      refreshToken: token,
      userId: createdUser.user.id,
      jti: randomUUID(),
    })

    const sendInviteAccessEmailUseCase = MakeSendInviteAccessEmailUseCase()
    await sendInviteAccessEmailUseCase.execute({
      name: createdUser.user.name,
      email: createdUser.user.email,
      token
    })

  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(201).send()
}
