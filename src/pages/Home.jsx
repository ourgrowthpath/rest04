import { useState } from 'react'
import { Link } from 'react-router-dom'
import { company, features, stats, videos } from '../data/site'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'
import ChatWidget from '../components/ChatWidget'

const PALETTE = [
  { name: 'Dark Navy', hex: '#0A1628', label: 'C1' },
  { name: 'Royal Blue', hex: '#1E40AF', label: 'C2' },
  { name: 'Sky Blue', hex: '#0EA5E9', label: 'C3' },
  { name: 'Teal', hex: '#0D9488', label: 'C4' },
  { name: 'Amber', hex: '#F59E0B', label: 'C5' },
]

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(null)
  const previewVideos = videos.slice(0, 6)

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-royal/20 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-brand-sky/15 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full bg-brand-teal/10 blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-container mx-auto section-x pt-28 pb-20 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-royal/40 border border-brand-royal/50 rounded-full px-4 py-1.5 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse-slow" />
              AI 전문 온라인 교육 플랫폼
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 animate-fade-in-up animate-delay-100">
              {company.tagline}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 animate-fade-in-up animate-delay-200">
              {company.description}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <Link to="/videos/ai" className="btn-primary text-base px-8 py-3.5">
                강의 보러가기
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/about" className="btn-outline border-white text-white hover:bg-white hover:text-brand-dark text-base px-8 py-3.5">
                회사소개
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-5 text-center animate-fade-in-up"
                style={{ animationDelay: `${(i + 4) * 0.1}s` }}
              >
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs animate-bounce">
          <span>스크롤</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Color Palette ───────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-brand-navy/50 py-10">
        <div className="max-w-container mx-auto section-x">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mr-2">
              컬러 팔레트
            </span>
            {PALETTE.map(c => (
              <div key={c.hex} className="flex items-center gap-2 bg-white dark:bg-brand-navy rounded-full px-4 py-2 shadow-sm">
                <div
                  className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-brand-navy shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
                <span className="text-xs text-gray-400 font-mono">{c.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-container mx-auto section-x">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              왜 성장패스 아카데미인가요?
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              AI 기술 변화에 뒤처지지 않도록, 실무에서 바로 활용 가능한 교육을 제공합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="card p-8 flex flex-col items-start hover:-translate-y-1"
              >
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Preview ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-brand-navy/30">
        <div className="max-w-container mx-auto section-x">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                최신 강의
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                AI 기술과 AI 리터러시 핵심 콘텐츠를 지금 바로 시청하세요.
              </p>
            </div>
            <Link to="/videos/ai" className="btn-outline shrink-0">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewVideos.map(v => (
              <VideoCard key={v.id} video={v} onClick={setActiveVideo} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-hero-gradient text-white overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-sky/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-teal/10 blur-3xl" />
        </div>
        <div className="relative max-w-container mx-auto section-x text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5">
            AI 역량, 지금 바로 키우세요
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg">
            무료로 제공되는 핵심 AI 강의들을 통해 디지털 시대의 경쟁력을 높이세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/videos/ai" className="bg-brand-amber text-brand-dark font-bold rounded-full px-8 py-3.5 hover:opacity-90 transition-opacity">
              AI 동영상 보기
            </Link>
            <Link to="/videos/ai-literacy" className="btn-outline border-white text-white hover:bg-white hover:text-brand-dark">
              AI 리터러시 보기
            </Link>
          </div>
        </div>
      </section>

      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}

      <ChatWidget />
    </>
  )
}
