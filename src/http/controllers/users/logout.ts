import { MakeRevokeTokensUseCase } from '@/use-cases/factories/make-revoke-tokens-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })

    const sub = request.user.sub

    const revokeTokensUseCase = MakeRevokeTokensUseCase()
    await revokeTokensUseCase.execute({
      actorId: sub,
      targetUserId: sub
    })
  } finally {
    return reply.clearCookie('refreshToken', {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    }).status(204).send()
  }
}
