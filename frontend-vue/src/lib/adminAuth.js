import { computed, reactive } from 'vue'
import { isMock } from '@/lib/supabase'

const ADMIN_STORAGE_KEY = 'boke.admin.local-authenticated'
const ADMIN_PASSWORD_KEY = 'boke.admin.password'
const fallbackDevPassword = import.meta.env.DEV ? 'admin' : ''
const state = reactive({
  initialized: false,
  authenticated: false,
  method: 'password',
})

function isBrowser() {
  return typeof window !== 'undefined'
}

function hasLocalAdminPassword() {
  return true
}

function hasLocalAdminSession() {
  return readLocalAdminFlag() && Boolean(readStoredAdminPassword())
}

function readLocalAdminFlag() {
  if (!isBrowser()) {
    return false
  }

  return window.localStorage.getItem(ADMIN_STORAGE_KEY) === '1'
}

function readStoredAdminPassword() {
  if (!isBrowser()) {
    return ''
  }

  const persistentPassword = window.localStorage.getItem(ADMIN_PASSWORD_KEY) || ''
  if (persistentPassword) {
    return persistentPassword
  }

  const legacySessionPassword = window.sessionStorage.getItem(ADMIN_PASSWORD_KEY) || ''
  if (legacySessionPassword) {
    window.localStorage.setItem(ADMIN_PASSWORD_KEY, legacySessionPassword)
    window.sessionStorage.removeItem(ADMIN_PASSWORD_KEY)
    return legacySessionPassword
  }

  return ''
}

function writeStoredAdminPassword(password) {
  if (!isBrowser()) {
    return
  }

  if (password) {
    window.localStorage.setItem(ADMIN_PASSWORD_KEY, password)
    window.sessionStorage.setItem(ADMIN_PASSWORD_KEY, password)
    return
  }

  window.localStorage.removeItem(ADMIN_PASSWORD_KEY)
  window.sessionStorage.removeItem(ADMIN_PASSWORD_KEY)
}

function writeLocalAdminFlag(value) {
  if (!isBrowser()) {
    return
  }

  if (value) {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, '1')
    return
  }

  window.localStorage.removeItem(ADMIN_STORAGE_KEY)
}

async function syncAdminState() {
  state.authenticated = hasLocalAdminSession()
  state.initialized = true
  return state.authenticated
}

export async function initAdminAuth() {
  return syncAdminState()
}

export async function loginWithLocalPassword(password) {
  if (!password?.trim()) {
    throw new Error('Admin password is required.')
  }

  writeLocalAdminFlag(true)
  writeStoredAdminPassword(password.trim())
  await syncAdminState()
  return true
}

export async function logoutAdmin() {
  writeLocalAdminFlag(false)
  writeStoredAdminPassword('')
  await syncAdminState()
}

export async function getAdminApiHeaders() {
  await initAdminAuth()
  if (!hasLocalAdminSession()) {
    throw new Error('Admin authentication is required')
  }

  const password = readStoredAdminPassword()
  if (!password) {
    writeLocalAdminFlag(false)
    throw new Error('Admin password session is missing')
  }

  return {
    'X-Admin-Password': password,
  }
}

export function useAdminAuth() {
  return {
    adminState: state,
    hasLocalAdminGate: computed(() => hasLocalAdminPassword()),
    localAdminUsesConfiguredPassword: computed(() => true),
    isMockAdminMode: computed(() => isMock),
  }
}
