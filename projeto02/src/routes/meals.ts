import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const sessionInfo = await knex('sessions').where('id', sessionId).first()

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date_time: z.string(),
        is_within_diet: z.boolean(),
      })

      const { name, description, date_time, is_within_diet } =
        createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date_time,
        is_within_diet,
        user_id: sessionInfo.user_id,
        updated_at: '',
      })

      return reply.status(201).send('Refeição criada com sucesso!')
    },
  )

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { user_id } = request.query

    if (!user_id) {
      const { sessionId } = request.cookies

      const sessionInfo = await knex('sessions').where('id', sessionId).first()

      const meals = await knex('meals')
        .where('user_id', sessionInfo.user_id)
        .select()

      return { meals }
    } else {
      const meals = await knex('meals').where('user_id', user_id).select()

      return { meals }
    }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    return { meal }
  })

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const updateMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        date_time: z.string().optional(),
        is_within_diet: z.boolean().optional(),
      })

      const { id } = updateMealParamsSchema.parse(request.params)

      const mealInfo = await knex('meals').where('id', id).first()

      const { name, description, date_time, is_within_diet } =
        updateMealBodySchema.parse(request.body)

      await knex('meals')
        .where('id', id)
        .update({
          name: name || mealInfo.name,
          description: description || mealInfo.description,
          date_time: date_time || mealInfo.date_time,
          is_within_diet: is_within_diet || mealInfo.is_within_diet,
          created_at: mealInfo.created_at,
          updated_at: new Date().toISOString().replace('T', ' ').split('.')[0],
        })

      return reply.status(200).send('Refeição atualizada com sucesso!')
    },
  )

  app.patch(
    '/:id/diet',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateMealParamsSchema.parse(request.params)

      const mealInfo = await knex('meals').where('id', id).first()

      await knex('meals')
        .where('id', id)
        .update({
          name: mealInfo.name,
          description: mealInfo.description,
          date_time: mealInfo.date_time,
          is_within_diet: !mealInfo.is_within_diet,
          updated_at: new Date().toISOString().replace('T', ' ').split('.')[0],
        })

      return reply.status(200).send('Refeição atualizada com sucesso!')
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteMealParamsSchema.parse(request.params)

      await knex('meals').where('id', id).delete()

      return reply.status(200).send('Refeição deletada com sucesso!')
    },
  )
}
