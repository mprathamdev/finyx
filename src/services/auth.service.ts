import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export const authService = {
  // Sign up with Email, Password, Name, and Phone
  async signUp({ email, password, fullName, phoneNumber }: {
    email: string
    password: string
    fullName: string
    phoneNumber: string
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        },
      },
    })
    if (error) throw error
    return data
  },

  // Login with Email & Password
  async loginWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Sign in with Google OAuth
  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  // Logout (Clears JWT & Session)
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user profile
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  }
}