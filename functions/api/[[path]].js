import { handleFetchRequest } from '../../server/apiHandler.mjs'

export async function onRequest({ request, env }) {
  return handleFetchRequest(request, env)
}
