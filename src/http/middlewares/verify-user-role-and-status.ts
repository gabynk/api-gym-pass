import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { MakeGetUserMembershipUseCase } from '@/use-cases/factories/make-get-user-membership-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

const VALID_GYM_ROLES = ['ADMIN', 'STAFF']

export function verifyIsValidUserToUpdateGym() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const createMembershipParamsSchema = z.object({
      gymId: z.string().uuid(),
    })

    const { gymId } = createMembershipParamsSchema.parse(request.params)

    try {
      const getUserMembership = MakeGetUserMembershipUseCase()

      const { userMembership } = await getUserMembership.execute({
        userId: request.user.sub,
        gymId: gymId,
      })

      const userRoles = [userMembership.membershipUser?.[0]?.role, userMembership.role]

      const allowed = userRoles.some((item) => VALID_GYM_ROLES.includes(item))

      if (!allowed) {
        throw new UnauthorizedError()
      }
    } catch (error) {
      return reply.status(403).send({ message: 'Unauthorized.' })
    }
  }
}
