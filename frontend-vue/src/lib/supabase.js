import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const placeholderValues = new Set([
  'YOUR_SUPABASE_URL',
  'your_supabase_url',
  'YOUR_SUPABASE_ANON_KEY',
  'your_supabase_anon_key',
])

const isPlaceholder = (value) => !value || placeholderValues.has(value)

const isConfigured = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey)

if (!isConfigured) {
  console.warn('Supabase is not configured. Using mock mode.')
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isMock = !isConfigured
