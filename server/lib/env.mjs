import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function readEnvFile(path) {
  if (!existsSync(path)) {
    return {}
  }

  const content = readFileSync(path, 'utf8')
  const entries = []

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue
    }

    const separator = trimmed.indexOf('=')
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    entries.push([key, value])
  }

  return Object.fromEntries(entries)
}

export function loadEnv(cwd = process.cwd()) {
  return {
    ...readEnvFile(resolve(cwd, '.env')),
    ...readEnvFile(resolve(cwd, '.env.local')),
    ...readEnvFile(resolve(cwd, 'server/.env')),
    ...readEnvFile(resolve(cwd, 'server/.env.local')),
    ...readEnvFile(resolve(cwd, 'frontend-vue/.env')),
    ...readEnvFile(resolve(cwd, 'frontend-vue/.env.local')),
    ...process.env,
  }
}
