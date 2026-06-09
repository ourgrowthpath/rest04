import { useState } from 'react'
import { company } from '../data/site'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  const contactItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: '주소',
      value: company.address,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: '전화',
      value: company.phone,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: '이메일',
      value: company.email,
    },
  ]

  return (
    <>
      {/* Header */}
      <section className="pt-24 pb-14 bg-hero-gradient text-white">
        <div className="max-w-container mx-auto section-x">
          <nav className="text-sm text-gray-400 mb-4">
            <span>홈</span>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">문의하기</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold">문의하기</h1>
          <p className="mt-3 text-gray-300">강의 관련 문의나 제안이 있으시면 언제든지 연락해 주세요.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-container mx-auto section-x">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">연락처</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  궁금하신 점이 있으시면 아래 연락처나 문의 양식을 통해 연락 주시기 바랍니다.
                  최대한 빠르게 답변 드리겠습니다.
                </p>
              </div>
              {contactItems.map((item, i) => (
                <div key={i} className="card p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-royal/10 dark:bg-brand-royal/20 text-brand-royal dark:text-brand-sky flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-1">{item.title}</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="card p-12 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal text-3xl">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">문의가 접수되었습니다!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    빠른 시일 내에 답변 드리겠습니다.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="btn-primary mt-2"
                  >
                    새 문의 작성
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">문의 양식</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="이름" name="name" value={form.name} onChange={handleChange} placeholder="홍길동" required />
                    <Field label="이메일" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                  </div>
                  <Field label="제목" name="subject" value={form.subject} onChange={handleChange} placeholder="문의 제목을 입력해 주세요" required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="문의 내용을 자세히 입력해 주세요"
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-brand-navy/50 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3.5">
                    문의 보내기
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-brand-navy/50 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-royal dark:focus:ring-brand-sky transition-all"
      />
    </div>
  )
}
