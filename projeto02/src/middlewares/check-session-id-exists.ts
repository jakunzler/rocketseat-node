import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  const session = await knex('sessions').where('id', sessionId).first()

  if (!session) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}
