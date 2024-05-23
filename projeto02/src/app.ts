import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { registerRoutes } from './routes'

export const app = fastify()

app.register(cookie)

registerRoutes(app)
