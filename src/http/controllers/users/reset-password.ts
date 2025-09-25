import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeVerifyTokensUseCase } from '@/use-cases/factories/make-verify-tokens-use-case'
import { MakeResetPasswordUseCase } from '@/use-cases/factories/make-reset-password-use-case'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { app } from '@/app'

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const resetPasswordQuerySchema = z.object({
    token: z.string(),
  })
  const resetPasswordBodySchema = z.object({
    password: z.string(),
  })

  try {
    const { token } = resetPasswordQuerySchema.parse(request.query)
    const { password } = resetPasswordBodySchema.parse(request.body)

    const decodedToken = await app.jwt.verify(token) as {
      gid?: string
      jti?: string
      sub?: string
      iat?: number
      exp?: number
    }

    if (!decodedToken?.jti || !decodedToken?.sub) {
      return reply.status(401).send({
        message: 'Request token not found',
      })
    }

    const verifyTokenUserCase = MakeVerifyTokensUseCase()
    const existToken = await verifyTokenUserCase.execute({
      jti: decodedToken.jti,
      userId: decodedToken.sub
    })

    const resetPasswordUseCase = MakeResetPasswordUseCase()
    await resetPasswordUseCase.execute({
      password,
      userId: existToken.token.user_id
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return reply.status(401).send({
        message: err.message,
      })
    }
    reply.status(401).send({
      message: 'Request token not found',
    })
  }
}
