export const company = {
  name: '성장패스 아카데미',
  nameEn: 'GrowthPath Academy',
  tagline: 'AI 시대를 이끌어갈 디지털 인재 양성',
  description:
    '성장패스 아카데미는 AI 기술과 AI 리터러시 교육을 통해 누구나 디지털 역량을 키울 수 있도록 돕는 온라인 교육 플랫폼입니다.',
  email: 'info@growthpath.kr',
  phone: '02-0000-0000',
  address: '서울특별시 강남구 테헤란로 123',
}

export const navigation = [
  { label: '홈', path: '/' },
  {
    label: '동영상',
    path: '/videos',
    children: [
      { label: 'AI 동영상', path: '/videos/ai', desc: 'AI 기술 핵심 강의' },
      { label: 'AI 리터러시', path: '/videos/ai-literacy', desc: 'AI 활용 역량 교육' },
    ],
  },
  { label: '회사소개', path: '/about' },
  { label: '문의하기', path: '/contact' },
]

export const features = [
  {
    icon: '🎯',
    title: '전문 AI 교육',
    desc: '업계 최고 전문가들이 제작한 AI 기술 심화 강의를 제공합니다.',
  },
  {
    icon: '📱',
    title: '어디서나 학습',
    desc: 'PC, 태블릿, 모바일 어디서나 편리하게 학습할 수 있습니다.',
  },
  {
    icon: '🚀',
    title: 'AI 리터러시',
    desc: 'AI 도구를 실무에 바로 적용할 수 있는 실전 중심 교육입니다.',
  },
]

export const stats = [
  { value: '50+', label: '전문 강의' },
  { value: '10,000+', label: '수강생' },
  { value: '98%', label: '만족도' },
  { value: '24/7', label: '학습 지원' },
]

/* ─── 동영상 데이터 ───────────────────────────────────────────────────────────
   youtubeId: YouTube 비디오 ID로 교체하세요.
   예) https://youtu.be/aircAruvnKk → youtubeId: 'aircAruvnKk'
   비공개/링크공개 영상도 동일하게 비디오 ID만 사용하면 됩니다.
──────────────────────────────────────────────────────────────────────────── */
export const videos = [
  // ── AI 동영상 ──────────────────────────────────────────────────────────────
  {
    id: 1,
    category: 'ai',
    title: '신경망이란 무엇인가? | 딥러닝 기초 1',
    desc: '신경망의 구조와 작동 원리를 시각적으로 쉽게 설명합니다. 퍼셉트론부터 다층 신경망까지 핵심 개념을 다룹니다.',
    youtubeId: 'aircAruvnKk',
    duration: '19:13',
    date: '2024-01',
  },
  {
    id: 2,
    category: 'ai',
    title: '경사하강법: 신경망이 학습하는 방법 | 딥러닝 기초 2',
    desc: '손실 함수와 경사하강법을 통해 신경망이 어떻게 스스로 최적화하는지 시각적으로 설명합니다.',
    youtubeId: 'IHZwWFHWa-w',
    duration: '21:01',
    date: '2024-02',
  },
  {
    id: 3,
    category: 'ai',
    title: '역전파 알고리즘의 원리 | 딥러닝 기초 3',
    desc: '딥러닝의 핵심인 역전파 알고리즘을 계산 그래프와 함께 직관적으로 이해합니다.',
    youtubeId: 'Ilg3gGewQ5U',
    duration: '13:54',
    date: '2024-03',
  },
  {
    id: 4,
    category: 'ai',
    title: '역전파 미적분학 | 딥러닝 기초 4',
    desc: '연쇄 법칙을 활용한 역전파의 수학적 근거를 단계별로 설명합니다.',
    youtubeId: 'tIeHLnjs5U8',
    duration: '10:17',
    date: '2024-04',
  },
  {
    id: 5,
    category: 'ai',
    title: 'GPT를 처음부터 만들어보자 | 트랜스포머 구현',
    desc: 'GPT 모델의 구조를 이해하고 파이썬 코드로 직접 구현하는 과정을 따라갑니다.',
    youtubeId: 'kCc8FmEb1nY',
    duration: '1:56:21',
    date: '2024-05',
  },
  {
    id: 6,
    category: 'ai',
    title: 'GPT란 무엇인가? | 트랜스포머 시각 입문',
    desc: '트랜스포머 아키텍처와 GPT가 텍스트를 생성하는 방식을 애니메이션으로 설명합니다.',
    youtubeId: 'VMj-3S1tku0',
    duration: '27:06',
    date: '2024-06',
  },
  {
    id: 7,
    category: 'ai',
    title: '어텐션 메커니즘 완전 이해 | 자연어처리',
    desc: '어텐션 메커니즘의 원리와 셀프 어텐션이 언어 모델에서 어떻게 동작하는지 설명합니다.',
    youtubeId: 'eMlx5fFNoYc',
    duration: '15:32',
    date: '2024-07',
  },
  {
    id: 8,
    category: 'ai',
    title: '컴퓨터 비전과 CNN | 이미지 인식의 원리',
    desc: '합성곱 신경망(CNN)이 이미지를 인식하는 방법과 주요 아키텍처를 소개합니다.',
    youtubeId: 'FmpDIaiMIeA',
    duration: '23:45',
    date: '2024-08',
  },
  // ── AI 리터러시 ───────────────────────────────────────────────────────────
  {
    id: 9,
    category: 'ai-literacy',
    title: 'AI 리터러시란? | 디지털 시대 필수 역량',
    desc: 'AI 리터러시의 개념과 왜 모든 직업인에게 필요한지, 어떻게 기를 수 있는지 안내합니다.',
    youtubeId: 'WXuK6gekU1Y',
    duration: '12:08',
    date: '2024-01',
  },
  {
    id: 10,
    category: 'ai-literacy',
    title: 'ChatGPT 업무 활용 완전 정복 | 프롬프트 엔지니어링',
    desc: '업무에서 ChatGPT를 효과적으로 활용하는 프롬프트 작성법과 실전 활용 예시를 소개합니다.',
    youtubeId: 'ua-CiDNNj30',
    duration: '28:14',
    date: '2024-02',
  },
  {
    id: 11,
    category: 'ai-literacy',
    title: 'AI 도구 한눈에 보기 | 생산성 2배 높이기',
    desc: '업무 생산성을 극대화하는 AI 도구들을 카테고리별로 정리하고 활용 방법을 설명합니다.',
    youtubeId: 'GVsUOuSsvag',
    duration: '20:30',
    date: '2024-03',
  },
  {
    id: 12,
    category: 'ai-literacy',
    title: 'AI 윤리와 책임 | 올바른 AI 사용법',
    desc: 'AI 기술의 편향성, 개인정보, 저작권 문제를 이해하고 책임감 있게 AI를 사용하는 방법을 다룹니다.',
    youtubeId: 'u9-P825Zifo',
    duration: '17:55',
    date: '2024-04',
  },
  {
    id: 13,
    category: 'ai-literacy',
    title: 'AI 이미지 생성 입문 | Midjourney & DALL-E 활용',
    desc: 'AI 이미지 생성 도구의 원리를 이해하고 실전에서 효과적인 프롬프트를 작성하는 방법을 알아봅니다.',
    youtubeId: '9vM4p9NN0Ts',
    duration: '25:18',
    date: '2024-05',
  },
  {
    id: 14,
    category: 'ai-literacy',
    title: 'AI와 미래 직업 | 변화하는 업무 환경 이해',
    desc: 'AI 자동화가 가져올 직업 변화를 분석하고 미래 경쟁력을 높이기 위한 방향을 제시합니다.',
    youtubeId: 'RzkD_rTEBYs',
    duration: '22:43',
    date: '2024-06',
  },
]
