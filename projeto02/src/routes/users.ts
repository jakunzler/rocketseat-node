import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function userRoutes(app: FastifyInstance) {
  app.post('/login/', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (!user) {
      throw new Error('Usuário e/ou senha incorreta')
    }

    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')

    if (user.password !== passwordHash) {
      throw new Error('Usuário e/ou senha incorreta')
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      await knex('sessions').insert({
        id: sessionId,
        user_id: user.id,
      })

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return reply.status(200).send('Usuário logado com sucesso!')
  })

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })

      const { name, email, password } = createUserBodySchema.parse(request.body)

      const passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')

      await knex('users').insert({
        id: randomUUID(),
        name,
        email,
        password: passwordHash,
        updated_at: '',
      })

      return reply.status(201).send('Usuário criado com sucesso!')
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async () => {
      const users = await knex('users').select()

      return { users }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      console.log('request.params', request.params)
      const getUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUserParamsSchema.parse(request.params)

      const user = await knex('users').where('id', id).first()

      return { user }
    },
  )

  app.get(
    '/summary/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getUserSummaryParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUserSummaryParamsSchema.parse(request.params)

      const summary = {}

      const meals = await knex('meals').where('user_id', id).select()

      summary.total_meals = meals.length
      summary.total_within_diet_meals = meals.filter(
        (meal) => meal.is_within_diet,
      ).length
      summary.total_outside_diet_meals = meals.filter(
        (meal) => !meal.is_within_diet,
      ).length
      summary.best_meal_streak = meals.reduce(
        (acc, meal) => {
          if (meal.is_within_diet) {
            acc.current++
            acc.best = Math.max(acc.current, acc.best)
          } else {
            acc.current = 0
          }

          return acc
        },
        { current: 0, best: 0 },
      )

      return { summary }
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const updateUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateUserParamsSchema.parse(request.params)

      const currentUser = await knex('users').where('id', id).first()
      console.log(currentUser)

      if (!currentUser) {
        throw new Error('Usuário não encontrado')
      }

      const updateUserBodySchema = z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().optional(),
      })

      const { name, email, password } = updateUserBodySchema.parse(request.body)

      if (currentUser.email === email) {
        throw new Error('Email já cadastrado')
      }

      await knex('users')
        .where('id', id)
        .update({
          name: name || currentUser.name,
          email: email || currentUser.email,
          password: password || currentUser.password,
          created_at: currentUser.created_at,
          updated_at: new Date().toISOString().replace('T', ' ').split('.')[0],
        })

      return reply.status(200).send('Usuário atualizado com sucesso!')
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const deleteUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteUserParamsSchema.parse(request.params)

      await knex('users').where('id', id).delete()

      return reply.status(200).send('Usuário deletado com sucesso!')
    },
  )
}
