import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function initSupabase(url: string, key: string): SupabaseClient {
  _client = createClient(url, key)
  localStorage.setItem('sb_url', url)
  localStorage.setItem('sb_key', key)
  return _client
}

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client
  const url = localStorage.getItem('sb_url')
  const key = localStorage.getItem('sb_key')
  if (url && key) {
    _client = createClient(url, key)
    return _client
  }
  return null
}

export function isConfigured(): boolean {
  return !!(localStorage.getItem('sb_url') && localStorage.getItem('sb_key'))
}

export function clearConfig(): void {
  _client = null
  localStorage.removeItem('sb_url')
  localStorage.removeItem('sb_key')
}
