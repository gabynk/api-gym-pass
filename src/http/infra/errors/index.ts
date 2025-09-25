import { env } from "@/env";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { STATUS_BY_ERROR_NAME } from "./status-by-error-name";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error('ERROR: ', error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  const name = (error as any).name ?? error.constructor?.name ?? 'Error'
  const errorCode = STATUS_BY_ERROR_NAME[name]

  if (errorCode) {
    return reply.status(errorCode).send({
      message: error.message,
    })
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
}