/**
 * OG 이미지 생성 스크립트 (sharp 사용)
 * 출력: public/og-image.png  (1200×630)
 */
import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = resolve(__dirname, '../public')
const OUT_FILE  = resolve(OUT_DIR, 'og-image.png')

mkdirSync(OUT_DIR, { recursive: true })

// ── 컬러 팔레트 ──────────────────────────────────────────────────────────────
const C = {
  darkNavy:  '#0A1628',
  navy:      '#0D1F3C',
  royal:     '#1E40AF',
  sky:       '#0EA5E9',
  teal:      '#0D9488',
  amber:     '#F59E0B',
  white:     '#FFFFFF',
  gray300:   '#D1D5DB',
  gray400:   '#9CA3AF',
}

const W = 1200
const H = 630

// ── 헬퍼: hex → {r,g,b} ──────────────────────────────────────────────────────
function hex(h) {
  const n = parseInt(h.replace('#',''), 16)
  return { r: (n>>16)&255, g: (n>>8)&255, b: n&255 }
}

// ── SVG 템플릿 ────────────────────────────────────────────────────────────────
const svg = /* xml */`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <!-- 배경 그라데이션: Dark Navy → Navy → Royal Blue -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${C.darkNavy}" />
      <stop offset="45%"  stop-color="${C.navy}" />
      <stop offset="100%" stop-color="${C.royal}" />
    </linearGradient>

    <!-- 보조 그라데이션 (우상단 블러 구체) -->
    <radialGradient id="glow1" cx="85%" cy="18%" r="35%">
      <stop offset="0%"   stop-color="${C.sky}"   stop-opacity="0.25" />
      <stop offset="100%" stop-color="${C.sky}"   stop-opacity="0" />
    </radialGradient>

    <!-- 좌하단 teal glow -->
    <radialGradient id="glow2" cx="10%" cy="85%" r="30%">
      <stop offset="0%"   stop-color="${C.teal}"  stop-opacity="0.20" />
      <stop offset="100%" stop-color="${C.teal}"  stop-opacity="0" />
    </radialGradient>

    <!-- amber glow (중앙 하단) -->
    <radialGradient id="glow3" cx="50%" cy="100%" r="28%">
      <stop offset="0%"   stop-color="${C.amber}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${C.amber}" stop-opacity="0" />
    </radialGradient>

    <!-- 텍스트 클립 -->
    <clipPath id="clip"><rect width="${W}" height="${H}" /></clipPath>
  </defs>

  <!-- 배경 -->
  <rect width="${W}" height="${H}" fill="url(#bg)" />

  <!-- Glow 레이어 -->
  <rect width="${W}" height="${H}" fill="url(#glow1)" />
  <rect width="${W}" height="${H}" fill="url(#glow2)" />
  <rect width="${W}" height="${H}" fill="url(#glow3)" />

  <!-- 격자 패턴 (미세 투명) -->
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="0.4" stroke-opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grid)" />

  <!-- 우상단 대형 원형 장식 -->
  <circle cx="1050" cy="-30" r="280"
    fill="none" stroke="${C.sky}" stroke-width="1.5" stroke-opacity="0.15" />
  <circle cx="1050" cy="-30" r="200"
    fill="none" stroke="${C.royal}" stroke-width="1" stroke-opacity="0.2" />

  <!-- 좌하단 소형 원형 장식 -->
  <circle cx="90" cy="590" r="160"
    fill="none" stroke="${C.teal}" stroke-width="1.5" stroke-opacity="0.18" />

  <!-- 좌측 액센트 바 (Royal Blue → Teal) -->
  <defs>
    <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="${C.royal}" />
      <stop offset="100%" stop-color="${C.teal}" />
    </linearGradient>
  </defs>
  <rect x="72" y="120" width="5" height="390" rx="3" fill="url(#barGrad)" />

  <!-- ── 로고 박스 ── -->
  <rect x="96" y="120" width="64" height="64" rx="14"
    fill="${C.royal}" />
  <text x="128" y="162"
    font-family="Arial, sans-serif" font-weight="800" font-size="24"
    fill="${C.white}" text-anchor="middle">GP</text>

  <!-- ── 브랜드명 (영문) ── -->
  <text x="96" y="225"
    font-family="Arial, sans-serif" font-weight="700" font-size="17"
    fill="${C.sky}" letter-spacing="3">
    GrowthPath Academy
  </text>

  <!-- ── 메인 타이틀 ── -->
  <text x="96" y="300"
    font-family="Arial, sans-serif" font-weight="800" font-size="56"
    fill="${C.white}">
    AI 시대를 이끌어갈
  </text>
  <text x="96" y="370"
    font-family="Arial, sans-serif" font-weight="800" font-size="56"
    fill="${C.white}">
    디지털 인재 양성
  </text>

  <!-- ── 서브 설명 ── -->
  <text x="96" y="430"
    font-family="Arial, sans-serif" font-weight="400" font-size="22"
    fill="${C.gray300}">
    AI 동영상 · AI 리터러시 온라인 교육 플랫폼
  </text>

  <!-- ── 컬러 팔레트 5개 원형 ── -->
  ${[C.darkNavy, C.royal, C.sky, C.teal, C.amber].map((color, i) => `
  <circle cx="${96 + i * 44}" cy="505" r="16"
    fill="${color}"
    stroke="white" stroke-width="2" stroke-opacity="0.3" />
  `).join('')}

  <!-- ── URL 배지 ── -->
  <rect x="96" y="545" width="400" height="42" rx="21"
    fill="${C.white}" fill-opacity="0.10"
    stroke="${C.sky}" stroke-width="1" stroke-opacity="0.5" />
  <text x="296" y="572"
    font-family="Arial, sans-serif" font-weight="500" font-size="16"
    fill="${C.gray300}" text-anchor="middle">
    ourgrowthpath.github.io/rest04
  </text>

  <!-- 우측 장식 패널 (반투명 카드) -->
  <rect x="750" y="160" width="360" height="310" rx="24"
    fill="${C.white}" fill-opacity="0.05"
    stroke="${C.sky}" stroke-width="1" stroke-opacity="0.2" />

  <!-- 카드 내 아이콘 행 -->
  ${[
    { icon: '🎯', label: '전문 AI 교육',   y: 230 },
    { icon: '📱', label: '어디서나 학습', y: 310 },
    { icon: '🚀', label: 'AI 리터러시',   y: 390 },
  ].map(({ label, y }) => `
  <rect x="778" y="${y - 26}" width="304" height="52" rx="12"
    fill="${C.white}" fill-opacity="0.06" />
  <text x="800" y="${y + 8}"
    font-family="Arial, sans-serif" font-weight="600" font-size="18"
    fill="${C.white}">${label}</text>
  `).join('')}

  <!-- 우측 Amber 액센트 점 3개 -->
  ${[0,1,2].map(i => `
  <circle cx="${1120 + i * 22}" cy="130" r="5"
    fill="${i === 0 ? C.amber : C.sky}"
    fill-opacity="${i === 0 ? 1 : 0.5}" />
  `).join('')}
</svg>
`

// sharp로 SVG → PNG 변환
sharp(Buffer.from(svg))
  .png()
  .toFile(OUT_FILE)
  .then(info => {
    console.log(`✅  OG 이미지 생성 완료`)
    console.log(`   파일: ${OUT_FILE}`)
    console.log(`   크기: ${info.width} × ${info.height} px`)
    console.log(`   용량: ${(info.size / 1024).toFixed(1)} KB`)
  })
  .catch(err => {
    console.error('❌  오류:', err.message)
    process.exit(1)
  })
