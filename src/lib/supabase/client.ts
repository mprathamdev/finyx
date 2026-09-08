import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Uses SessionStorage so closing the browser window expires the session
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
        persistSession: true,
      },
    }
  )
}