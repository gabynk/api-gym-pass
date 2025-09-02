import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { MakeCreateTokensUseCase } from '@/use-cases/factories/make-create-tokens-use-case'
import { MakeVerifyTokensUseCase } from '@/use-cases/factories/make-verify-tokens-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const sub = request.user.sub

    const verifyTokenUserCase = MakeVerifyTokensUseCase()

    await verifyTokenUserCase.execute({
      userId: sub,
    })

    const token = await reply.jwtSign({}, {
      sign: {
        sub,
        expiresIn: '10m',
      },
    },
    )

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub,
        expiresIn: '7d',
      },
    },
    )

    const createTokenUserCase = MakeCreateTokensUseCase()

    await createTokenUserCase.execute({
      refreshToken,
      userId: sub,
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
    if (err instanceof UnauthorizedError) {
      return reply.clearCookie('refreshToken', {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      }).status(401).send({
        message: err.message,
      })
    }

    return reply.clearCookie('refreshToken', {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    }).status(401).send({
      message: 'Request token not found',
    })
  }
}
