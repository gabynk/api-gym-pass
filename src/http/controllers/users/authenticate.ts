import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { MakeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { MakeCreateTokensUseCase } from '@/use-cases/factories/make-create-tokens-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUserCase = MakeAuthenticateUseCase()

    const { user } = await authenticateUserCase.execute({
      email,
      password,
    })

    const jti = randomUUID()

    const token = await reply.jwtSign({
      jti
    }, {
      sign: {
        sub: user.id,
        expiresIn: '10m',
      },
    },
    )

    const refreshToken = await reply.jwtSign({
      jti
    }, {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    },
    )

    const createTokenUserCase = MakeCreateTokensUseCase()

    await createTokenUserCase.execute({
      refreshToken,
      userId: user.id,
      jti,
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }
}
