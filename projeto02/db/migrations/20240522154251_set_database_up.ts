import type { Knex } from 'knex'
import crypto, { randomUUID } from 'node:crypto'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.timestamps(true, true)
  })

  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable().references('id').inTable('users')
    table.timestamps(true, true)
  })

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable().references('id').inTable('users')
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('date_time').defaultTo(knex.fn.now()).notNullable()
    table.boolean('is_within_diet').notNullable()
    table.timestamps(true, true)
  })

  // Adicionando um usuário padrão
  const passwordHash = crypto
    .createHash('sha256')
    .update('123456')
    .digest('hex')

  await knex('users').insert({
    id: randomUUID(),
    name: 'Administrador',
    email: 'admin@email.com',
    password: passwordHash,
    updated_at: '',
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
  await knex.schema.dropTable('sessions')
  await knex.schema.dropTable('users')
}
