import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function formatDate(str) {
  return new Date(str).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function BoardDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        navigate('/board', { replace: true })
        return
      }

      setPost(data)
      setLoading(false)

      await supabase
        .from('posts')
        .update({ views: data.views + 1 })
        .eq('id', id)
    }
    fetchPost()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return
    setDeleting(true)
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (!error) {
      navigate('/board', { replace: true })
    } else {
      alert('삭제에 실패했습니다.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark">
        <div className="w-8 h-8 border-4 border-brand-royal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isAuthor = user?.id === post.author_id

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark pt-20 pb-16">
      <div className="max-w-3xl mx-auto section-x">
        <div className="pt-8 mb-6">
          <Link
            to="/board"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-royal dark:hover:text-brand-sky transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            게시판으로
          </Link>
        </div>

        <div className="card p-8">
          {/* Title */}
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-brand-royal/10 flex items-center justify-center text-brand-royal dark:text-brand-sky text-xs font-bold">
                  {post.author_name?.[0]?.toUpperCase()}
                </div>
                {post.author_name}
              </span>
              <span>{formatDate(post.created_at)}</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views}
              </span>
            </div>
            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/board/edit/${post.id}`)}
                  className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-sm px-4 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
              {post.content}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-6 flex justify-center">
          <Link to="/board" className="btn-outline text-sm py-2.5">목록으로</Link>
        </div>
      </div>
    </div>
  )
}
