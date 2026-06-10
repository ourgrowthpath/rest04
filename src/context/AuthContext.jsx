import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password, displayName) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })

  const signInWithKakao = () =>
    supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin },
    })

  const signOut = () => supabase.auth.signOut()

  const displayName = user?.user_metadata?.display_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || '사용자'

  return (
    <AuthContext.Provider value={{ user, loading, displayName, signIn, signUp, signInWithKakao, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
