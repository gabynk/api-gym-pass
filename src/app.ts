import './lib/sentry'

import fastify from 'fastify'

import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { adminRoutes } from './http/controllers/admin/routes'
import { errorHandler } from './http/infra/errors'
import { Sentry } from './lib/sentry'

export const app = fastify()

Sentry.setupFastifyErrorHandler(app);

app.get("/debug-sentry", () => {
  throw new Error("Debug Sentry Error!");
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(adminRoutes)
app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler(errorHandler)
