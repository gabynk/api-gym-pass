import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { createMembership } from './create-membership'
import { changeUserStatus } from './change-user-status'
import { verifyIsValidUserToUpdateGym } from '@/http/middlewares/verify-user-role-and-status'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/members', { onRequest: [verifyIsValidUserToUpdateGym()] }, createMembership)
  app.patch('/gyms/:gymId/members/status', { onRequest: [verifyIsValidUserToUpdateGym()] }, changeUserStatus)
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
