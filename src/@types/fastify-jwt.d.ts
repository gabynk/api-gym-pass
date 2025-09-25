import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string,
      jti: string,
      gid?: string,
    }
  }
}
