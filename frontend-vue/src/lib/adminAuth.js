import { computed, reactive } from 'vue'
import { isMock } from '@/lib/supabase'

const ADMIN_STORAGE_KEY = 'boke.admin.local-authenticated'
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
  return readLocalAdminFlag()
}

function readLocalAdminFlag() {
  if (!isBrowser()) {
    return false
  }

  return window.localStorage.getItem(ADMIN_STORAGE_KEY) === '1'
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
  if (isBrowser()) {
    window.sessionStorage.setItem('boke.admin.password', password)
  }
  await syncAdminState()
  return true
}

export async function logoutAdmin() {
  writeLocalAdminFlag(false)
  if (isBrowser()) {
    window.sessionStorage.removeItem('boke.admin.password')
  }
  await syncAdminState()
}

export async function getAdminApiHeaders() {
  await initAdminAuth()
  if (!hasLocalAdminSession()) {
    throw new Error('Admin authentication is required')
  }

  const password = isBrowser() ? window.sessionStorage.getItem('boke.admin.password') || '' : ''
  if (!password) {
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
