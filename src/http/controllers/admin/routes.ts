import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { revoke } from './revoke'

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.patch(
    '/admin/users/:userId/revoke',
    { onRequest: [verifyUserRole('ADMIN')] },
    revoke,
  )
}
