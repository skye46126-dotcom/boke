import { createServer } from 'node:http'
import { createAppContextFromEnv } from './appContext.mjs'
import { loadEnv } from './lib/env.mjs'
import { handleNodeRequest } from './apiHandler.mjs'

const context = createAppContextFromEnv(loadEnv())
const {
  config,
} = context

const server = createServer(async (req, res) => {
  await handleNodeRequest(req, res, context)
})

server.listen(config.port, '127.0.0.1', () => {
  console.log(`API server listening on http://127.0.0.1:${config.port}`)
})
