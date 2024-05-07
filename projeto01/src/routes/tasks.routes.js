import { randomUUID } from 'node:crypto'
import { buildRoutePath } from '../utils/build-route-path.js'

export class TasksRoutes {

  constructor(database) {
    this.database = database
  }

  build() {
    return [
      {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
          const { search } = req.query

          const tasks = this.database.select('tasks', search ? {
            title: search,
            description: search,
            completed_at: search,
            created_at: search,
            updated_at: search,
          } : null)

          console.log(typeof tasks)

          return res.end(JSON.stringify(tasks))
        }
      },
      {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
          const {
            title,
            description,
          } = req.body

          if (title === undefined || description === undefined) {
            return res.writeHead(400).end()
          }

          const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: null,
          }

          this.database.insert('tasks', task)

          return res.writeHead(201).end()
        }
      },
      {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
          const { id } = req.params
          const {
            title,
            description,
          } = req.body

          const task = this.database.select('tasks', { id })

          if (task.length === 0) {
            return res.writeHead(404).end()
          }

          this.database.update('tasks', id, {
            title: title || task[0].title,
            description: description || task[0].description,
            completed_at: null,
            created_at: task[0].created_at,
            updated_at: new Date().toISOString(),
          })

          return res.writeHead(204).end()
        }
      },
      {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
          const { id } = req.params

          const task = this.database.select('tasks', { id })

          if (task.length === 0) {
            return res.writeHead(404).end()
          }

          this.database.update('tasks', id, {
            title: task[0].title,
            description: task[0].description,
            completed_at: new Date().toISOString(),
            created_at: task[0].created_at,
            updated_at: new Date().toISOString(),
          })

          return res.writeHead(204).end()
        }
      },
      {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
          const { id } = req.params

          const task = this.database.select('tasks', { id })

          if (task.length === 0) {
            return res.writeHead(404).end()
          }

          this.database.delete('tasks', id)

          return res.writeHead(204).end()
        }
      }
    ]
  }
}
