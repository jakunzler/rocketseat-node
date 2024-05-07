import { randomUUID } from 'node:crypto'
import { buildRoutePath } from '../utils/build-route-path.js'

export class UsersRoutes {

  constructor(database) {
    this.database = database
  }

  build() {
    return [
      {
        method: 'GET',
        path: buildRoutePath('/users'),
        handler: (req, res) => {
          const { search } = req.query

          const users = this.database.select('users', search ? {
            name: search,
            email: search,
            created_at: search,
            updated_at: search,
          } : null)

          return res.end(JSON.stringify(users))
        }
      },
      {
        method: 'POST',
        path: buildRoutePath('/users'),
        handler: (req, res) => {
          const { name, email } = req.body

          if (name === undefined || email === undefined) {
            return res.writeHead(400).end()
          }

          if (this.database.select('users', { email }).length > 0) {
            return res.writeHead(409).end()
          }

          const user = {
            id: randomUUID(),
            name,
            email,
            created_at: new Date().toISOString(),
            updated_at: null,
          }

          this.database.insert('users', user)

          return res.writeHead(201).end()
        }
      },
      {
        method: 'PUT',
        path: buildRoutePath('/users/:id'),
        handler: (req, res) => {
          const { id } = req.params
          const { name, email } = req.body

          const user = this.database.select('users', { id })

          if (user.length === 0) {
            return res.writeHead(404).end()
          }

          const newUserInfo = {
            name: name || user[0].name,
            email: email || user[0].email,
            created_at: user[0].created_at,
            updated_at: new Date().toISOString(),
          }

          this.database.update('users', id, newUserInfo)

          const updated_user = JSON.stringify(this.database.select('users', { id })[0])

          return res.writeHead(204).end(updated_user)
        }
      },
      {
        method: 'DELETE',
        path: buildRoutePath('/users/:id'),
        handler: (req, res) => {
          const { id } = req.params

          const user = this.database.select('users', { id })

          if (user.length === 0) {
            return res.writeHead(404).end()
          }

          this.database.delete('users', id)

          return res.writeHead(204).end()
        }
      }
    ]
  }
}
