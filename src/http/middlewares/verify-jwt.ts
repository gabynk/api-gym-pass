import { MakeVerifyTokensUseCase } from '@/use-cases/factories/make-verify-tokens-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()

    const { jti } = request.user

    const verifyTokenUserCase = MakeVerifyTokensUseCase()
    await verifyTokenUserCase.execute({
      jti,
    })

  } catch (err) {
    return reply.clearCookie('refreshToken', {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    }).status(401).send({ message: 'Unauthorized.' })
  }
}
