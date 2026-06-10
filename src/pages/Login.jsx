import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signInWithKakao } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleKakao = async () => {
    setError('')
    const { error } = await signInWithKakao()
    if (error) setError('카카오 로그인에 실패했습니다.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark px-4 py-20">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-royal flex items-center justify-center text-white font-bold text-sm">
                GP
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">성장패스 아카데미</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">로그인</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-brand-royal dark:text-brand-sky font-semibold hover:underline">
                회원가입
              </Link>
            </p>
          </div>

          {/* Kakao Login */}
          <button
            type="button"
            onClick={handleKakao}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-gray-900 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 mb-6"
            style={{ backgroundColor: '#FEE500' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C6.477 3 2 6.477 2 11c0 2.99 1.657 5.616 4.132 7.189l-1.05 3.818a.375.375 0 0 0 .548.416L9.97 19.77A11.14 11.14 0 0 0 12 20c5.523 0 10-3.477 10-8S17.523 3 12 3z" fill="#3C1E1E"/>
            </svg>
            카카오로 로그인
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-brand-navy text-gray-400">또는 이메일로 로그인</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  로그인 중...
                </span>
              ) : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
