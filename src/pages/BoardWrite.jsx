import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function BoardWrite() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { user, displayName } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    supabase.from('posts').select('title, content, author_id').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data || data.author_id !== user?.id) {
          navigate('/board', { replace: true })
          return
        }
        setForm({ title: data.title, content: data.content })
        setFetchLoading(false)
      })
  }, [id, isEdit, user, navigate])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('제목을 입력해 주세요.'); return }
    if (!form.content.trim()) { setError('내용을 입력해 주세요.'); return }

    setLoading(true)

    if (isEdit) {
      const { error } = await supabase
        .from('posts')
        .update({ title: form.title.trim(), content: form.content.trim() })
        .eq('id', id)
      setLoading(false)
      if (error) { setError('수정에 실패했습니다.'); return }
      navigate(`/board/${id}`)
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({ title: form.title.trim(), content: form.content.trim(), author_id: user.id, author_name: displayName })
        .select('id')
        .single()
      setLoading(false)
      if (error) { setError('등록에 실패했습니다.'); return }
      navigate(`/board/${data.id}`)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark">
        <div className="w-8 h-8 border-4 border-brand-royal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark pt-20 pb-16">
      <div className="max-w-3xl mx-auto section-x">
        <div className="pt-8 mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {isEdit ? '게시글 수정' : '게시글 작성'}
          </h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">제목</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">내용</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={16}
                placeholder="내용을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all resize-y leading-relaxed"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline flex-1 justify-center py-3"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEdit ? '수정 중...' : '등록 중...'}
                  </span>
                ) : isEdit ? '수정 완료' : '등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
