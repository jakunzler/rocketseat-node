import http from 'node:http'

import { json } from './middlewares/json.js'
import routes from './routes/index.js'
import { extractQueryParams } from './utils/extract-query-params.js'

import './utils/load-env-var.js'

const port = process.env.PORT || '3000'
const host = process.env.HOST || '127.0.0.1'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  console.log(method, url)

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`)
})
