import process from 'node:process'
import { loadEnv } from '../server/lib/env.mjs'

function readString(value, fallback = '') {
  const resolved = value ?? fallback
  return String(resolved).trim()
}

function resolveBaseUrl(env) {
  const explicit = readString(process.env.CONTENT_HUB_BASE_URL || env.CONTENT_HUB_BASE_URL)
  if (explicit) {
    return explicit.replace(/\/+$/, '')
  }

  const port = Number(process.env.API_PORT || env.API_PORT || process.env.PORT || env.PORT || 8787)
  return `http://127.0.0.1:${Number.isFinite(port) && port > 0 ? port : 8787}`
}

export function getTestConfig() {
  const env = loadEnv(process.cwd())
  const timeoutMs = Number(process.env.CONTENT_HUB_REQUEST_TIMEOUT_MS || env.CONTENT_HUB_REQUEST_TIMEOUT_MS || 15000)

  return {
    baseUrl: resolveBaseUrl(env),
    adminPassword: readString(
      process.env.CONTENT_HUB_ADMIN_PASSWORD ||
      env.CONTENT_HUB_ADMIN_PASSWORD ||
      process.env.ADMIN_PASSWORD ||
      env.ADMIN_PASSWORD ||
      process.env.ADMIN_DEV_PASSWORD ||
      env.ADMIN_DEV_PASSWORD ||
      process.env.VITE_ADMIN_PASSWORD ||
      env.VITE_ADMIN_PASSWORD ||
      (process.env.NODE_ENV !== 'production' ? 'admin' : ''),
    ),
    agentToken: readString(process.env.AGENT_API_TOKEN || env.AGENT_API_TOKEN),
    externalFramework: readString(process.env.CONTENT_HUB_EXTERNAL_FRAMEWORK || env.CONTENT_HUB_EXTERNAL_FRAMEWORK, 'vcptoolbox'),
    externalAgentKey: readString(process.env.CONTENT_HUB_EXTERNAL_AGENT_KEY || env.CONTENT_HUB_EXTERNAL_AGENT_KEY, 'content-hub-smoke-agent'),
    agentName: readString(process.env.CONTENT_HUB_AGENT_NAME || env.CONTENT_HUB_AGENT_NAME, 'Content Hub Smoke Agent'),
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 15000,
  }
}

export function assertRequired(name, value) {
  if (!readString(value)) {
    throw new Error(`${name} is required for this script`)
  }
}

export function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export function createRunId(prefix = 'content-hub-smoke') {
  const stamp = new Date().toISOString().replace(/[^\d]/g, '').slice(0, 14)
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${stamp}-${suffix}`
}

export function printStep(message) {
  console.log(`\n[content-hub] ${message}`)
}

export function printSuccess(message) {
  console.log(`[content-hub] OK ${message}`)
}

export async function requestJson({
  baseUrl,
  path,
  method = 'GET',
  headers = {},
  body,
  expectStatus = 200,
  timeoutMs = 15000,
}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...headers,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    const raw = await response.text()
    const payload = raw ? JSON.parse(raw) : null
    const expected = Array.isArray(expectStatus) ? expectStatus : [expectStatus]

    if (!expected.includes(response.status)) {
      const message = payload?.error || payload?.message || raw || 'Request failed'
      throw new Error(`${method} ${path} returned ${response.status}: ${message}`)
    }

    return payload
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`${method} ${path} timed out after ${timeoutMs}ms`)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
