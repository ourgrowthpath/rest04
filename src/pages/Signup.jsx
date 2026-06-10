import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', displayName: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.displayName)
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('이미 사용 중인 이메일입니다.')
      } else {
        setError(error.message)
      }
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark px-4 py-20">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">이메일을 확인해 주세요</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {form.email}로 인증 이메일을 발송했습니다.
              이메일 인증 후 로그인이 가능합니다.
            </p>
            <Link to="/login" className="btn-primary justify-center">로그인 페이지로</Link>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">회원가입</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-brand-royal dark:text-brand-sky font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">닉네임</label>
              <input
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                required
                placeholder="사용할 닉네임을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이메일</label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">비밀번호</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="6자 이상 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
                placeholder="비밀번호를 다시 입력하세요"
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
                  처리 중...
                </span>
              ) : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
