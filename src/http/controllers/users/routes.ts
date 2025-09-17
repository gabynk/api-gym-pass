import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyIsValidUserToUpdateGym } from '@/http/middlewares/verify-user-role-and-status'

import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { refresh } from './refresh'
import { logout } from './logout'
import { registerAndSendEmail } from './register-and-send-email'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.patch('/token/refresh', refresh)
  app.post('/logout', logout)

  app.get('/me', { onRequest: [verifyJWT] }, profile)

  app.post('/gyms/:gymId/users', { onRequest: [verifyJWT, verifyIsValidUserToUpdateGym()] }, registerAndSendEmail)
}
