import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 15

function formatDate(str) {
  const d = new Date(str)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export default function Board() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1')
  const currentSearch = searchParams.get('q') || ''

  const [posts, setPosts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(currentSearch)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('posts')
      .select('id, title, author_name, views, created_at, content', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (currentSearch) {
      query = query.or(`title.ilike.%${currentSearch}%,content.ilike.%${currentSearch}%`)
    }

    const { data, count, error } = await query
    if (!error) {
      setPosts(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [currentPage, currentSearch])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleSearch = e => {
    e.preventDefault()
    setSearchParams(searchInput ? { q: searchInput, page: '1' } : { page: '1' })
  }

  const handlePage = p => {
    const params = { page: String(p) }
    if (currentSearch) params.q = currentSearch
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark pt-20 pb-16">
      <div className="max-w-4xl mx-auto section-x">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">게시판</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">총 {totalCount}개의 게시글</p>
          </div>
          {user && (
            <button onClick={() => navigate('/board/write')} className="btn-primary text-sm py-2.5 px-5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              글쓰기
            </button>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="제목 또는 내용으로 검색"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all text-sm"
          />
          <button type="submit" className="btn-primary text-sm py-2.5 px-5">검색</button>
          {currentSearch && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setSearchParams({ page: '1' }) }}
              className="btn-outline text-sm py-2.5 px-4"
            >
              초기화
            </button>
          )}
        </form>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-brand-royal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-12 h-12 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-medium">{currentSearch ? '검색 결과가 없습니다' : '첫 번째 게시글을 작성해 보세요'}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {/* Header row */}
              <div className="hidden sm:grid grid-cols-[1fr_120px_80px_90px] px-6 py-3 bg-gray-50 dark:bg-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span>제목</span>
                <span>작성자</span>
                <span className="text-right">조회</span>
                <span className="text-right">날짜</span>
              </div>
              {posts.map(post => (
                <Link
                  key={post.id}
                  to={`/board/${post.id}`}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px_90px] items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-sky transition-colors truncate pr-4">
                    {post.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{post.author_name}</div>
                  <div className="text-sm text-gray-400 text-right">{post.views}</div>
                  <div className="text-xs text-gray-400 text-right">{formatDate(post.created_at)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1 mt-6">
            <button
              onClick={() => handlePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === currentPage
                        ? 'bg-brand-royal text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => handlePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
