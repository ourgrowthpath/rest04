import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { videos } from '../data/site'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'ai', label: 'AI 동영상' },
  { key: 'ai-literacy', label: 'AI 리터러시' },
]

const PER_PAGE = 6

export default function Videos() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [activeVideo, setActiveVideo] = useState(null)
  const [page, setPage] = useState(1)

  const catKey = category === 'ai-literacy' ? 'ai-literacy' : category === 'all' ? 'all' : 'ai'

  const filtered = useMemo(
    () => (catKey === 'all' ? videos : videos.filter(v => v.category === catKey)),
    [catKey],
  )

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleCat(key) {
    setPage(1)
    navigate(key === 'all' ? '/videos/all' : `/videos/${key}`)
  }

  const catInfo = {
    ai: { title: 'AI 동영상', desc: 'AI 핵심 기술을 시각적으로 쉽게 배우는 전문 강의 시리즈입니다.' },
    'ai-literacy': { title: 'AI 리터러시', desc: '누구나 AI를 실무에 활용할 수 있도록 돕는 실전 교육 강의입니다.' },
    all: { title: '전체 동영상', desc: '모든 카테고리의 강의를 한 곳에서 확인하세요.' },
  }

  const info = catInfo[catKey]

  return (
    <>
      {/* Page header */}
      <section className="pt-24 pb-12 bg-hero-gradient text-white">
        <div className="max-w-container mx-auto section-x">
          <nav className="text-sm text-gray-400 mb-4" aria-label="breadcrumb">
            <span>홈</span>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">동영상</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold">{info.title}</h1>
          <p className="mt-3 text-gray-300 max-w-xl">{info.desc}</p>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mt-8">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => handleCat(c.key)}
                className={`tab-btn ${catKey === c.key ? 'tab-btn-active' : 'tab-btn-inactive bg-white/10 text-white hover:bg-white/20'}`}
              >
                {c.label}
                <span className="ml-1.5 text-xs opacity-70">
                  ({c.key === 'all' ? videos.length : videos.filter(v => v.category === c.key).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-container mx-auto section-x">
          {paged.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🎬</div>
              <p>등록된 영상이 없습니다.</p>
            </div>
          ) : (
            <>
              {/* 2-col × 3-row grid on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {paged.map(v => (
                  <VideoCard key={v.id} video={v} onClick={setActiveVideo} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination current={page} total={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }) }} />
              )}
            </>
          )}
        </div>
      </section>

      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </>
  )
}

function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <nav aria-label="페이지 탐색" className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/20
          text-gray-600 dark:text-gray-400 hover:bg-brand-royal hover:text-white hover:border-brand-royal
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200
          dark:disabled:hover:text-gray-400 dark:disabled:hover:border-white/20
          transition-all duration-200"
        aria-label="이전 페이지"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={current === p ? 'page' : undefined}
          className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200
            ${current === p
              ? 'bg-brand-royal text-white shadow-md shadow-brand-royal/30'
              : 'border border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:bg-brand-royal hover:text-white hover:border-brand-royal'
            }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/20
          text-gray-600 dark:text-gray-400 hover:bg-brand-royal hover:text-white hover:border-brand-royal
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200
          dark:disabled:hover:text-gray-400 dark:disabled:hover:border-white/20
          transition-all duration-200"
        aria-label="다음 페이지"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}
