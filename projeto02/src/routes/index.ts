import { FastifyInstance } from 'fastify'
import { userRoutes } from './users'
import { mealRoutes } from './meals'

export async function registerRoutes(app: FastifyInstance) {
  app.register(userRoutes, { prefix: '/users' })
  app.register(mealRoutes, { prefix: '/meals' })
}
