import { randomUUID } from 'node:crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { MakeCreateTokensUseCase } from '@/use-cases/factories/make-create-tokens-use-case'
import { MakeVerifyTokensUseCase } from '@/use-cases/factories/make-verify-tokens-use-case'
import { MakeRevokeTokenByJtiUseCase } from '@/use-cases/factories/make-revoke-token-by-jti-use-case'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const { sub, jti } = request.user

    const verifyTokenUserCase = MakeVerifyTokensUseCase()
    const existToken = await verifyTokenUserCase.execute({
      jti,
    })

    const revokeTokenByJtiUseCase = MakeRevokeTokenByJtiUseCase()
    await revokeTokenByJtiUseCase.execute({
      userId: sub,
      jti,
    })

    const newJti = randomUUID()

    const token = await reply.jwtSign({
      jti: newJti
    }, {
      sign: {
        sub,
        expiresIn: '10m',
      },
    },
    )

    const refreshToken = await reply.jwtSign({
      jti: newJti
    }, {
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
      jti: newJti,
      oldJti: existToken.token.jti
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
