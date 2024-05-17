import http from 'node:http'
import cron from 'node-cron'
import moment from 'moment-timezone';

import { parseBody } from './middlewares/parse-body/index.js'
import routes from './routes/index.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { processCsvFiles } from './db/etl/job-to-do.js'

import './utils/load-env-var.js'

const port = process.env.PORT || '3000'
const host = process.env.HOST || '127.0.0.1'

const desiredLocation = 'America/Sao_Paulo';

const localTime = moment().format('YYYY-MM-DDTHH:mm:ssZ');
const desiredTime = moment().tz(desiredLocation).format('YYYY-MM-DDTHH:mm:ssZ');

const timezoneHourDifference = Number(desiredTime.slice(-6, -3)) - Number(localTime.slice(-6, -3));

const scheduledHour = 1
const convertedHour = (scheduledHour + timezoneHourDifference + 24) % 24;

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  req.body = await parseBody(req, res)

  // console.log('Request:', { method, url, body: req.body })

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

  cron.schedule(`0 ${convertedHour} * * *`, () => {
    console.log('Running the scheduled task every day at 1:00 AM of the desired location.')
    processCsvFiles();
  })

})
