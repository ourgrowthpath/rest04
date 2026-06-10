import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { navigation, company } from '../data/site'

export default function Header() {
  const { dark, toggle } = useTheme()
  const { user, displayName, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [videoDropdown, setVideoDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const userDropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setVideoDropdown(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const headerCls = scrolled
    ? 'bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md shadow-md shadow-brand-dark/10'
    : 'bg-white/80 dark:bg-brand-dark/80 backdrop-blur-sm'

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${headerCls}`}>
      <div className="max-w-container mx-auto section-x">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-brand-royal flex items-center justify-center text-white font-bold text-sm">
              GP
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg hidden sm:block">
              {company.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map(item =>
              item.children ? (
                <div
                  key={item.label}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setVideoDropdown(true)}
                  onMouseLeave={() => setVideoDropdown(false)}
                >
                  <button
                    className="nav-link flex items-center gap-1 py-2"
                    onClick={() => navigate('/videos/ai')}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${videoDropdown ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {videoDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-52">
                      <div className="card p-2 shadow-xl">
                        {item.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            onClick={() => setVideoDropdown(false)}
                          >
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{child.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{child.desc}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'font-semibold text-brand-royal dark:text-brand-sky' : 'nav-link'
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth buttons (desktop) */}
            {user ? (
              <div ref={userDropdownRef} className="relative hidden lg:block">
                <button
                  onClick={() => setUserDropdown(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-royal flex items-center justify-center text-white text-xs font-bold">
                    {displayName?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[100px] truncate">{displayName}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-40">
                    <div className="card p-1.5 shadow-xl">
                      <button
                        onClick={() => { signOut(); setUserDropdown(false) }}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden lg:inline-flex btn-primary text-sm py-2 px-4">
                로그인
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="메뉴 열기"
            >
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 relative
                before:content-[''] before:absolute before:block before:w-5 before:h-0.5 before:bg-current before:transition-all before:duration-300
                after:content-[''] after:absolute after:block after:w-5 after:h-0.5 after:bg-current after:transition-all after:duration-300
                ${menuOpen
                  ? 'bg-transparent before:rotate-45 before:top-0 after:-rotate-45 after:top-0'
                  : 'before:-top-1.5 after:top-1.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Panel */}
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-white dark:bg-brand-navy shadow-2xl transition-transform duration-300 flex flex-col p-6 gap-2 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {navigation.map(item =>
            item.children ? (
              <div key={item.label}>
                <button
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setMobileVideoOpen(v => !v)}
                >
                  {item.label}
                  <svg
                    className={`w-4 h-4 transition-transform ${mobileVideoOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileVideoOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {item.children.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium text-brand-royal dark:text-brand-sky hover:bg-blue-50 dark:hover:bg-brand-royal/20 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-3 rounded-xl font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-7 h-7 rounded-full bg-brand-royal flex items-center justify-center text-white text-xs font-bold">
                    {displayName?.[0]?.toUpperCase()}
                  </div>
                  <span className="truncate">{displayName}</span>
                </div>
                <button
                  onClick={() => { signOut(); setMenuOpen(false) }}
                  className="w-full text-center py-3 rounded-xl text-sm font-medium text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary w-full justify-center" onClick={() => setMenuOpen(false)}>
                  로그인
                </Link>
                <Link to="/signup" className="btn-outline w-full justify-center" onClick={() => setMenuOpen(false)}>
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
