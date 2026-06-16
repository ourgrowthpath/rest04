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
      options: {
        scopes: 'profile_nickname',
        // 앱은 GitHub Pages 서브경로(/rest04/)에 있으므로 루트가 아닌
        // 앱 경로로 돌아와야 세션 토큰(해시)이 처리된다.
        // BASE_URL = '/rest04/' (vite.config base) → 배포·로컬 모두 자동 대응.
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
      },
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
