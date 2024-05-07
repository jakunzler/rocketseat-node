import fastify from 'fastify'
import { knexBuilder } from './database'

const app = fastify()

app.get('/hello', async () => {
  const tables = await knexBuilder('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server started at 3000')
  })
