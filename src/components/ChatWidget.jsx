import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const WELCOME = {
  role: 'assistant',
  content: '안녕하세요! 성장패스 아카데미 AI 도우미예요. 강의나 이용 방법에 대해 무엇이든 물어보세요 😊',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // 페이지 진입 후 잠시 뒤 안내 말풍선 노출 (한 번이라도 열면 다시 안 띄움)
  useEffect(() => {
    if (open) return
    const t = setTimeout(() => setShowHint(true), 1800)
    return () => clearTimeout(t)
  }, [open])

  // 새 메시지/로딩 시 맨 아래로 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // 열릴 때 입력창 포커스
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      // 시스템 메시지는 Edge Function에서 추가하므로 user/assistant만 전달
      const payload = nextMessages.filter(m => m !== WELCOME)
      const { data, error } = await supabase.functions.invoke('syu-chat', {
        body: { messages: payload },
      })

      if (error) {
        // FunctionsHttpError 인 경우 error.context(Response)에서 상태/본문 추출
        let detail = ''
        try {
          if (error.context && typeof error.context.text === 'function') {
            detail = `status=${error.context.status} body=${await error.context.text()}`
          }
        } catch { /* ignore */ }
        console.error('[syu-chat] invoke 실패:', error.name, error.message, detail)
        setMessages(m => [...m, {
          role: 'assistant',
          content: '죄송합니다. 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.',
        }])
      } else if (!data?.reply) {
        console.error('[syu-chat] reply 없음, 응답:', data)
        setMessages(m => [...m, {
          role: 'assistant',
          content: data?.error || '죄송합니다. 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.',
        }])
      } else {
        setMessages(m => [...m, { role: 'assistant', content: data.reply }])
      }
    } catch (e) {
      console.error('[syu-chat] 네트워크 예외:', e)
      setMessages(m => [...m, {
        role: 'assistant',
        content: '네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* ── 런처 영역 ──────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {/* 안내 말풍선 (닫혀 있을 때만) */}
        {!open && showHint && (
          <div className="mb-2 max-w-[16rem] animate-pop-in relative
            bg-white dark:bg-brand-navy text-gray-800 dark:text-gray-100
            rounded-2xl rounded-br-sm shadow-xl border border-gray-100 dark:border-white/10
            px-4 py-3 text-sm leading-snug">
            <button
              onClick={() => setShowHint(false)}
              aria-label="안내 닫기"
              className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-gray-300 dark:bg-white/20
                text-gray-700 dark:text-white text-xs flex items-center justify-center hover:bg-gray-400"
            >
              ×
            </button>
            <span className="font-bold text-brand-royal dark:text-brand-sky">AI 도우미</span>에게
            무엇이든 물어보세요! 👋
          </div>
        )}

        <div className="relative">
          {/* 펄스 후광 (닫혀 있을 때만) */}
          {!open && (
            <>
              <span className="absolute inset-0 rounded-full bg-brand-amber animate-halo pointer-events-none" />
              <span className="absolute inset-0 rounded-full bg-brand-sky animate-halo pointer-events-none"
                style={{ animationDelay: '1s' }} />
            </>
          )}

          <button
            onClick={() => { setOpen(o => !o); setShowHint(false) }}
            aria-label={open ? '채팅 닫기' : '채팅 열기'}
            className={`relative w-16 h-16 rounded-full text-white flex items-center justify-center
              shadow-2xl shadow-brand-royal/50 ring-4 ring-white/70 dark:ring-white/10
              bg-gradient-to-br from-brand-royal via-brand-sky to-brand-teal
              transition-all duration-300 hover:scale-110 hover:shadow-brand-sky/60
              ${open ? '' : 'animate-float'}`}
          >
            {open ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
          </button>

          {/* 온라인 표시 점 (닫혀 있을 때만) */}
          {!open && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-amber ring-2 ring-white" />
            </span>
          )}
        </div>
      </div>

      {/* ── 채팅 패널 ──────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[32rem] max-h-[70vh]
            flex flex-col rounded-2xl overflow-hidden shadow-2xl
            bg-white dark:bg-brand-navy border border-gray-200 dark:border-white/10
            animate-fade-in-up"
        >
          {/* 헤더 */}
          <div className="bg-hero-gradient text-white px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-amber animate-pulse-slow" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">AI 상담 도우미</p>
              <p className="text-xs text-gray-300">성장패스 아카데미</p>
            </div>
          </div>

          {/* 메시지 목록 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-brand-navy/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    m.role === 'user'
                      ? 'bg-brand-royal text-white rounded-br-md'
                      : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-brand-navy shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="메시지를 입력하세요…"
                className="flex-1 resize-none max-h-28 px-3 py-2.5 rounded-xl text-sm
                  bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-100
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/50"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="전송"
                className="shrink-0 w-10 h-10 rounded-xl bg-brand-royal text-white flex items-center justify-center
                  transition-colors hover:bg-brand-sky disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
