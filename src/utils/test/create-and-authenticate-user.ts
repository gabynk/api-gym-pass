import { prisma } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const name = faker.internet.username().replace(/[_.-]/g, "")
  const email = faker.internet.email()
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'USER',
    },
  })

  const authResponse = await request(app.server).post('/session').send({
    email,
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
    user,
  }
}
