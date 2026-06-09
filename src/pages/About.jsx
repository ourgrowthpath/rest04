import { company } from '../data/site'

const values = [
  {
    icon: '💡',
    title: '혁신',
    desc: '급변하는 AI 기술 트렌드를 가장 빠르게 학습자에게 전달합니다.',
  },
  {
    icon: '🤝',
    title: '접근성',
    desc: '기술적 배경에 관계없이 누구나 쉽게 AI를 이해하고 활용할 수 있도록 돕습니다.',
  },
  {
    icon: '🎯',
    title: '실용성',
    desc: '이론에 그치지 않고 실무에 즉시 적용할 수 있는 실전 교육을 제공합니다.',
  },
  {
    icon: '🌱',
    title: '성장',
    desc: '학습자와 함께 성장하며, 지속적인 커리큘럼 업데이트로 항상 최신 내용을 제공합니다.',
  },
]

const timeline = [
  { year: '2022', title: '성장패스 아카데미 설립', desc: 'AI 교육 전문 플랫폼으로 출발' },
  { year: '2023', title: 'AI 리터러시 과정 런칭', desc: '비전공자를 위한 AI 실무 교육 시작' },
  { year: '2024', title: '유튜브 채널 1만 구독자 달성', desc: 'AI 동영상 콘텐츠 확장' },
  { year: '2025', title: '온라인 교육 플랫폼 전면 리뉴얼', desc: '더 나은 학습 경험 제공' },
]

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="pt-24 pb-14 bg-hero-gradient text-white">
        <div className="max-w-container mx-auto section-x">
          <nav className="text-sm text-gray-400 mb-4">
            <span>홈</span>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">회사소개</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold">회사소개</h1>
          <p className="mt-3 text-gray-300">성장패스 아카데미가 걸어온 길과 우리의 철학을 소개합니다.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="max-w-container mx-auto section-x">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-royal dark:text-brand-sky font-semibold text-sm uppercase tracking-widest">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 mb-6">
                모든 사람이 AI를 활용할 수 있는 세상을 만듭니다
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg mb-6">
                {company.description}
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                우리는 AI 기술의 장벽을 낮추고, 학습자가 자신의 분야에서 AI를 강력한 도구로 활용할 수 있도록
                최적의 교육 콘텐츠를 제공합니다. 전문가 수준의 AI 기술 강의부터 일반인을 위한 AI 리터러시
                교육까지, 누구나 성장할 수 있는 학습 환경을 만들어 갑니다.
              </p>
            </div>
            {/* Visual element */}
            <div className="relative">
              <div className="rounded-3xl bg-hero-gradient p-10 text-white aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl font-black text-white/10 select-none mb-4">GP</div>
                  <div className="text-2xl font-extrabold mb-2">{company.tagline}</div>
                  <div className="text-brand-sky font-medium">{company.nameEn}</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-brand-amber/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-brand-teal/20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-brand-navy/30">
        <div className="max-w-container mx-auto section-x">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">핵심 가치</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card p-7 hover:-translate-y-1">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28">
        <div className="max-w-container mx-auto section-x">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">연혁</h2>
          </div>
          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-royal via-brand-sky to-brand-teal" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-royal text-white flex items-center justify-center font-bold text-sm z-10 relative shadow-lg shadow-brand-royal/30">
                      {item.year.slice(2)}
                    </div>
                  </div>
                  <div className="card p-5 flex-1 hover:-translate-y-0.5">
                    <div className="text-xs text-brand-royal dark:text-brand-sky font-semibold mb-1">{item.year}</div>
                    <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
