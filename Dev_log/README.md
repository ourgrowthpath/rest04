# 성장패스 아카데미 — 개발일지 v3

> **온라인 AI 교육 플랫폼 rest04** · 전체 개발 기록 최종본

| 항목 | 내용 |
|------|------|
| 프로젝트 | 성장패스 아카데미 (GrowthPath Academy) |
| 리포지토리 | https://github.com/ourgrowthpath/rest04 |
| 배포 URL | https://ourgrowthpath.github.io/rest04/ |
| 참조 리포 | https://github.com/aebonlee/rest03 |
| 개발 기간 | 2026-06-09 |
| 최종 커밋 | `f77e40e` |

---

## 목차

1. [요구사항 & 완료 현황](#1-요구사항--완료-현황)
2. [기술 스택 & 선택 근거](#2-기술-스택--선택-근거)
3. [컬러 팔레트 설계](#3-컬러-팔레트-설계)
4. [전체 파일 구조](#4-전체-파일-구조)
5. [개발 단계별 기록](#5-개발-단계별-기록)
   - 5-1 참조 리포 분석
   - 5-2 프로젝트 셋업
   - 5-3 데이터 레이어
   - 5-4 공통 컴포넌트
   - 5-5 페이지 개발
   - 5-6 초기 빌드 & 배포
   - 5-7 OG 이미지 생성
   - 5-8 OG 메타태그 적용
6. [주요 기능 구현 가이드](#6-주요-기능-구현-가이드)
7. [빌드 & 배포 파이프라인](#7-빌드--배포-파이프라인)
8. [전체 커밋 이력](#8-전체-커밋-이력)
9. [배포 이력 & 검증 결과](#9-배포-이력--검증-결과)
10. [향후 작업 계획](#10-향후-작업-계획)

---

## 1. 요구사항 & 완료 현황

| # | 요구사항 | 완료 |
|---|---------|:----:|
| 1 | 다크블루·로열블루 기반 5색 컬러 팔레트 (CSS 변수 + Tailwind 확장) | ✅ |
| 2 | 다크모드 / 라이트모드 전환 — localStorage 유지, 시스템 설정 자동 감지 | ✅ |
| 3 | 모바일 완전 최적화 — 반응형 그리드, 햄버거 메뉴 | ✅ |
| 4 | 유튜브 동영상 임베드 — 비공개/링크공개 영상 지원, 모달 재생 | ✅ |
| 5 | 동영상 2열 × 3행 그리드 + 페이지네이션 | ✅ |
| 6 | 주제별 카테고리 메뉴 (AI 동영상 / AI 리터러시) | ✅ |
| 7 | OG 메타태그 6종 + OG 이미지 (1200×630) — 카카오·SNS 공유 최적화 | ✅ |
| 8 | GitHub Actions 자동 빌드·배포 (main 푸시 시 트리거) | ✅ |
| 9 | 개발일지 리포지토리 업로드 | ✅ |

---

## 2. 기술 스택 & 선택 근거

### 프론트엔드

| 기술 | 버전 | 선택 근거 |
|------|------|-----------|
| **React** | 18.3.1 | 컴포넌트 단위 설계, Context API로 전역 테마 관리 |
| **Vite** | 5.4.8 | 빠른 HMR, ES module 네이티브, 경량 번들 출력 |
| **Tailwind CSS** | 3.4.13 | 유틸리티 퍼스트, `darkMode: 'class'` 내장 지원 |
| **React Router DOM** | 6.26.2 | HashRouter — GitHub Pages 정적 호스팅에서 클라이언트 라우팅 가능 |
| **Pretendard** | CDN | 한국어 최적화 가변 폰트, subset 동적 로딩으로 성능 유지 |

### 빌드 & 도구

| 기술 | 용도 |
|------|------|
| **sharp** | OG 이미지 생성 (SVG → PNG 변환), `--no-save` 임시 설치 |
| **GitHub Actions** | CI/CD 파이프라인 (npm ci → vite build → pages 배포) |
| **GitHub Pages** | 정적 호스팅, `build_type: workflow` 설정 |

### 참조 리포지토리(rest03) 분석 결론

rest03(건설회사 기업 사이트)에서 다음 패턴을 그대로 계승:

- `HashRouter` — GitHub Pages 서브패스 호환
- `src/data/site.js` 중앙 데이터 관리 — 콘텐츠 교체가 단일 파일로 완결
- `section-x` 유틸리티 클래스 — 일관된 수평 패딩
- Tailwind `darkMode: 'class'` + localStorage 조합

교육 플랫폼에 맞게 **동영상 중심 구조**로 재설계: 메가 드롭다운 대신 카테고리 탭 기반 영상 목록으로 전환.

---

## 3. 컬러 팔레트 설계

5색을 **CSS 커스텀 프로퍼티**와 **Tailwind `brand` 네임스페이스**로 이중 정의하여 어디서든 일관성 확보.

| 코드 | 이름 | HEX | 사용처 |
|:----:|------|:---:|--------|
| **C1** | Dark Navy | `#0A1628` | 배경 베이스, 히어로 그라데이션 시작점, OG 배경 기저 |
| **C2** | Royal Blue | `#1E40AF` | 주 강조색, 버튼, NavLink 활성, OG 그라데이션 종점 |
| **C3** | Sky Blue | `#0EA5E9` | 보조 강조, 다크모드 포인트, OG Glow, 드롭다운 텍스트 |
| **C4** | Teal | `#0D9488` | AI 리터러시 배지, 타임라인 그라데이션, OG Glow |
| **C5** | Amber | `#F59E0B` | CTA 버튼, 히어로 펄스 점, OG 액센트 |

```css
/* src/index.css */
:root {
  --c1: #0A1628;  /* Dark Navy  */
  --c2: #1E40AF;  /* Royal Blue */
  --c3: #0EA5E9;  /* Sky Blue   */
  --c4: #0D9488;  /* Teal       */
  --c5: #F59E0B;  /* Amber      */
}
```

```js
// tailwind.config.js
colors: {
  brand: {
    dark:  '#0A1628',
    navy:  '#0D1F3C',
    royal: '#1E40AF',
    sky:   '#0EA5E9',
    teal:  '#0D9488',
    amber: '#F59E0B',
  },
}
```

홈 페이지 **컬러 팔레트 섹션**에서 5색 스와치 + 이름 + HEX를 시각적으로 표시.

---

## 4. 전체 파일 구조

```
rest04/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD
│
├── Dev_log/
│   └── README.md                   # 개발일지 (현재 파일)
│
├── public/
│   └── og-image.png                # OG 이미지 1200×630 (sharp로 생성)
│
├── scripts/
│   └── generate-og.mjs             # OG 이미지 생성 스크립트
│
├── src/
│   ├── main.jsx                    # 진입점 — ThemeProvider + HashRouter
│   ├── App.jsx                     # 라우팅 설정
│   ├── index.css                   # Tailwind base + 커스텀 유틸리티
│   │
│   ├── context/
│   │   └── ThemeContext.jsx        # 다크/라이트 전역 상태
│   │
│   ├── data/
│   │   └── site.js                 # 중앙 데이터 (회사·동영상·네비게이션·특장점·통계)
│   │
│   ├── components/
│   │   ├── Header.jsx              # 고정 헤더, hover 드롭다운, 햄버거, 모드 토글
│   │   ├── Footer.jsx              # 회사정보·링크·소셜
│   │   ├── ScrollToTop.jsx         # 라우트 변경 시 스크롤 0 초기화
│   │   ├── ScrollToTopButton.jsx   # 스크롤 400px 이상 시 플로팅 버튼
│   │   ├── VideoCard.jsx           # 유튜브 썸네일 카드 + 카테고리 배지
│   │   └── VideoModal.jsx          # iframe 영상 모달 (ESC·배경클릭 닫기)
│   │
│   └── pages/
│       ├── Home.jsx                # Hero / 팔레트 / Features / 영상 미리보기 / CTA
│       ├── Videos.jsx              # 카테고리 탭 + 2×3 그리드 + 페이지네이션
│       ├── About.jsx               # 미션 / 핵심 가치 / 연혁 타임라인
│       └── Contact.jsx             # 연락처 카드 + 문의 폼
│
├── index.html                      # OG 메타태그 + 다크모드 FOUC 방지 스크립트
├── package.json                    # scripts: dev·build·preview·og
├── vite.config.js                  # base: '/rest04/'
├── tailwind.config.js              # darkMode·brand 컬러·커스텀 키프레임
└── postcss.config.js
```

---

## 5. 개발 단계별 기록

### 5-1. 참조 리포지토리 분석

**대상**: `aebonlee/rest03`

분석 방법: GitHub REST API를 통해 파일 트리 탐색 → 주요 파일 raw 콘텐츠 다운로드 → 아키텍처 패턴 추출

도출된 재사용 패턴:

```
HashRouter + vite base 경로 → GitHub Pages 서브패스 대응
site.js 중앙 데이터        → 콘텐츠 교체가 단일 파일로 완결
section-x 유틸리티         → 수평 패딩 일관화
darkMode: 'class'          → html 요소에 클래스 토글
```

---

### 5-2. 프로젝트 셋업

```bash
git clone https://github.com/ourgrowthpath/rest04.git
# 초기 상태: README.md만 존재

mkdir -p src/{components,pages,data,context} .github/workflows scripts public
```

**설정 파일 주요 포인트**

`vite.config.js`
```js
export default defineConfig({
  plugins: [react()],
  base: '/rest04/',   // GitHub Pages 서브패스 필수
})
```

`tailwind.config.js`
```js
darkMode: 'class',  // html.dark 클래스 기반 다크모드
theme: { extend: { colors: { brand: { ... } } } }
```

`index.html` — FOUC(Flash Of Unstyled Content) 방지 인라인 스크립트
```html
<script>
  (function () {
    var saved = localStorage.getItem('theme');
    var sys   = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && sys))
      document.documentElement.classList.add('dark');
  })();
</script>
```
> React 앱 로드 전에 실행되어 다크/라이트 전환 깜빡임을 원천 차단.

---

### 5-3. 데이터 레이어 (`src/data/site.js`)

모든 콘텐츠를 단일 파일로 관리 — 영상 ID·회사정보·메뉴 구조를 여기서만 수정하면 전체 반영.

```js
export const company    // 이름·태그라인·연락처·주소
export const navigation // 메뉴 구조 (드롭다운 포함)
export const features   // 홈 특장점 카드 3개
export const stats      // 홈 통계 수치 4개
export const videos     // 동영상 목록
```

**동영상 스키마**
```js
{
  id:        Number,
  category:  'ai' | 'ai-literacy',
  title:     String,
  desc:      String,
  youtubeId: String,   // YouTube 비디오 ID (11자리)
  duration:  String,   // '19:13' 형식
  date:      String,   // '2024-01' 형식
}
```

초기 데이터: AI 동영상 8개 + AI 리터러시 6개 = **총 14개** (예시 ID 포함)

---

### 5-4. 공통 컴포넌트

#### `ThemeContext.jsx`

```jsx
const [dark, setDark] = useState(() => {
  const saved = localStorage.getItem('theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})

useEffect(() => {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}, [dark])
```

우선순위: `localStorage` → 시스템 `prefers-color-scheme` → 기본값 라이트

---

#### `Header.jsx`

| 기능 | 구현 방법 |
|------|-----------|
| 스크롤 투명도 | `scrollY > 20` 감지 → `backdrop-blur` + `shadow` 동적 적용 |
| 동영상 드롭다운 | 데스크탑: `onMouseEnter/Leave` hover / 모바일: 아코디언 토글 |
| 햄버거 → X | CSS `before/after` pseudo-element `rotate` 트랜지션 |
| 배경 클릭 닫기 | 오버레이 div `onClick` → `setMenuOpen(false)` |
| 다크 토글 | `useTheme().toggle()` 호출, 해/달 아이콘 조건부 렌더 |

---

#### `VideoCard.jsx`

```
YouTube 썸네일 API
  https://img.youtube.com/vi/{youtubeId}/hqdefault.jpg

onError 처리
  img.style.display = 'none' → 썸네일 없어도 레이아웃 깨지지 않음

카테고리 배지
  'ai'           → Royal Blue  배경
  'ai-literacy'  → Teal        배경

재생 시간 배지
  우하단 고정, 반투명 검정 배경
```

---

#### `VideoModal.jsx`

```
열기: VideoCard 클릭 → setActiveVideo(video)
닫기: ESC 키 | 배경 클릭
iframe: autoplay=1&rel=0 (관련 영상 숨김)
body overflow: hidden (스크롤 잠금)
```

---

### 5-5. 페이지 개발

#### `Home.jsx`

| 섹션 | 핵심 구현 |
|------|-----------|
| **Hero** | `bg-hero-gradient` + blurred 원형 데코 3개 + 격자 패턴 오버레이. 통계 4개를 `glass` 카드로 표시. 스크롤 인디케이터 bounce 애니메이션 |
| **Color Palette** | 5색 스와치 + 이름 + HEX를 가로 스크롤 pill 형태로 표시 |
| **Features** | 아이콘·제목·설명 카드 3개, hover 시 `-translate-y-1` |
| **Video Preview** | `videos.slice(0,6)` 3열 그리드, "전체 보기" 링크 |
| **CTA** | Amber 버튼 + Outline 버튼 이중 배치, 배경은 히어로와 동일 그라데이션 |

#### `Videos.jsx`

```
라우팅:  /videos/:category  (ai | ai-literacy | all)
탭 전환: navigate() + setPage(1) 동시 실행
그리드:  grid-cols-1 sm:grid-cols-2  (모바일 1열 / 태블릿↑ 2열)
페이지:  PER_PAGE = 6  (2열 × 3행)
페이지네이션: 이전·다음 + 번호 버튼, 변경 시 scrollTo(0, 300)
모달:   activeVideo state → VideoModal
```

#### `About.jsx`

```
미션:     텍스트 + 그라데이션 비주얼 박스 (lg:grid-cols-2)
핵심 가치: 4개 카드 (sm:grid-cols-2 lg:grid-cols-4)
연혁:     수직선 그라데이션 + 연도 원형 배지 타임라인
```

#### `Contact.jsx`

```
레이아웃: lg:grid-cols-5 (정보 2 + 폼 3)
연락처:   주소·전화·이메일 아이콘 카드
폼:       Field 컴포넌트 재사용, 제출 → 성공 UI 전환
```

---

### 5-6. 초기 빌드 & 배포

```bash
$ npm run build
✓ 46 modules transformed.
dist/index.html                  1.14 kB │ gzip:  0.69 kB
dist/assets/index-C_fg0tJR.css  37.26 kB │ gzip:  6.47 kB
dist/assets/index-CtA1Qmyz.js  205.10 kB │ gzip: 64.95 kB
✓ built in 1.34s
```

**GitHub Pages `build_type` 전환**

초기 상태가 `legacy`(브랜치 배포)였으므로 REST API로 `workflow`로 변경:

```bash
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/ourgrowthpath/rest04/pages \
  -d '{"build_type":"workflow"}'
```

→ `build_type: legacy` ➜ `build_type: workflow` 변경 완료

---

### 5-7. OG 이미지 생성 (`scripts/generate-og.mjs`)

**도구 선택**

| 도구 | 평가 |
|------|------|
| `canvas` npm 패키지 | 풍부한 2D API. 네이티브 빌드 의존성으로 설치 실패 가능성 |
| **`sharp`** (채택) | SVG 인풋 → PNG 출력. 경량·빠름. `--no-save` 임시 설치로 의존성 비오염 |
| 온라인 생성 도구 | 반복 재생성 자동화 불가 |

```bash
npm install --no-save sharp   # 임시 설치 (package.json 미기록)
node scripts/generate-og.mjs  # 또는 npm run og
```

**SVG 레이어 구조** (하단 → 상단)

```
 1  bg gradient    Dark Navy → Navy → Royal Blue  (135°)
 2  glow sky       radial, 우상단, opacity 0.25
 3  glow teal      radial, 좌하단, opacity 0.20
 4  glow amber     radial, 중앙 하단, opacity 0.18
 5  grid pattern   60px 격자, stroke opacity 0.06
 6  circle deco    우상단 stroke 원 2개 (sky·royal)
 7  circle deco    좌하단 stroke 원 (teal)
 8  accent bar     좌측 세로 바 — Royal Blue → Teal 그라데이션
 9  GP logo box    Royal Blue 사각형 + "GP" 텍스트
10  brand name     "GrowthPath Academy"  (Sky Blue, letter-spacing 3)
11  title line 1   "AI 시대를 이끌어갈"  (White, 56px ExtraBold)
12  title line 2   "디지털 인재 양성"    (White, 56px ExtraBold)
13  subtitle       "AI 동영상 · AI 리터러시 온라인 교육 플랫폼"  (Gray 300, 22px)
14  palette dots   C1~C5 원형 5개 (stroke white 0.3)
15  url badge      반투명 pill + "ourgrowthpath.github.io/rest04"
16  right card     반투명 패널 + 특징 3개 텍스트
17  amber dots     우상단 Amber·Sky 점 3개
```

**출력**
```
파일: public/og-image.png
크기: 1200 × 630 px
용량: ~235 KB
```

---

### 5-8. OG 메타태그 적용 (`index.html`)

6종 Open Graph + Twitter Card 메타태그:

```html
<meta property="og:type"         content="website" />
<meta property="og:site_name"    content="성장패스 아카데미" />
<meta property="og:url"          content="https://ourgrowthpath.github.io/rest04/" />
<meta property="og:title"        content="성장패스 아카데미 | AI 교육 플랫폼" />
<meta property="og:description"  content="AI 기술과 AI 리터러시 교육으로 디지털 역량을 키우는 온라인 교육 플랫폼입니다." />
<meta property="og:image"        content="https://ourgrowthpath.github.io/rest04/og-image.png" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"    content="성장패스 아카데미 — AI 시대를 이끌어갈 디지털 인재 양성" />
<meta property="og:locale"       content="ko_KR" />

<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="성장패스 아카데미 | AI 교육 플랫폼" />
<meta name="twitter:description" content="AI 기술과 AI 리터러시 교육으로 디지털 역량을 키우는 온라인 교육 플랫폼입니다." />
<meta name="twitter:image"       content="https://ourgrowthpath.github.io/rest04/og-image.png" />
```

**Vite `public/` 폴더 전략**

`public/og-image.png` → 빌드 시 `dist/og-image.png`로 자동 복사. 코드 import 불필요.

**카카오 공유 디버거 검증**
```
URL: https://ourgrowthpath.github.io/rest04/
→ https://developers.kakao.com/tool/debugger/sharing
```

---

## 6. 주요 기능 구현 가이드

### 유튜브 영상 교체

`src/data/site.js` 의 `youtubeId` 값만 변경 후 커밋:

```js
// 변경 전 (예시 ID)
{ youtubeId: 'aircAruvnKk' }

// 변경 후 (본인 업로드 영상)
// https://youtu.be/ABC123defGH  →  마지막 11자리
{ youtubeId: 'ABC123defGH' }
```

> **비공개 영상 주의** — YouTube 임베드는 **링크 공개** 설정 영상만 정상 동작합니다.

---

### OG 이미지 재생성

브랜드·문구 변경 시:

```bash
npm install --no-save sharp      # 미설치 시
npm run og                       # public/og-image.png 재생성
git add public/og-image.png
git commit -m "chore: OG 이미지 업데이트"
git push
```

---

### 동영상 카테고리 추가

```js
// 1. src/data/site.js — videos 배열에 추가
{ ..., category: 'prompt' }

// 2. src/data/site.js — navigation 서브메뉴에 추가
{ label: '프롬프트 엔지니어링', path: '/videos/prompt', desc: '...' }
```

```jsx
// 3. src/pages/Videos.jsx — CATEGORIES 배열에 추가
{ key: 'prompt', label: '프롬프트 엔지니어링' }
```

---

### 다크/라이트 모드 흐름

```
index.html 인라인 스크립트 (FOUC 방지, 동기 실행)
    ↓
ThemeProvider 마운트 (localStorage → 시스템 설정 → 기본 라이트)
    ↓
useEffect: document.documentElement.classList.toggle('dark', dark)
           localStorage.setItem('theme', ...)
    ↓
Header 토글 버튼 클릭 → toggle() → dark 반전 → useEffect 재실행
```

---

## 7. 빌드 & 배포 파이프라인

### GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
on:
  push:
    branches: [main]   # 자동 트리거
  workflow_dispatch:   # 수동 트리거

jobs:
  build:
    - actions/checkout@v4
    - actions/setup-node@v4  (Node 20, npm cache)
    - npm ci
    - npm run build
    - actions/upload-pages-artifact@v3  (dist/)

  deploy:
    needs: build
    environment: github-pages
    - actions/deploy-pages@v4
```

### 로컬 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 → http://localhost:5173/rest04/
npm run build        # 프로덕션 빌드 → dist/
npm run preview      # 빌드 결과 로컬 확인
npm run og           # OG 이미지 재생성 (sharp 필요)
```

### 빌드 출력 (최신)

```
dist/index.html                  2.25 kB │ gzip:  1.02 kB
dist/assets/index-C_fg0tJR.css  37.26 kB │ gzip:  6.47 kB
dist/assets/index-CtA1Qmyz.js  205.10 kB │ gzip: 64.95 kB
dist/og-image.png               234.7 KB  (public/ 자동 복사)
```

---

## 8. 전체 커밋 이력

| # | 해시 | 날짜 | 커밋 메시지 | 변경 파일 수 |
|---|------|------|-------------|:----------:|
| 1 | `efe1587` | 2026-06-09 | Initial commit | 1 |
| 2 | `242fef9` | 2026-06-09 | feat: 온라인 AI 교육 사이트 초기 구축 | 23 |
| 3 | `2808987` | 2026-06-09 | docs: 프로젝트 개발일지 작성 | 1 |
| 4 | `c526631` | 2026-06-09 | feat: OG 메타태그 및 OG 이미지 추가 | 4 |
| 5 | `f77e40e` | 2026-06-09 | docs: 개발일지 전면 업데이트 | 1 |

### 커밋 #2 상세 (23개 파일)

```
.github/workflows/deploy.yml
.gitignore
index.html
package.json / package-lock.json
postcss.config.js / tailwind.config.js / vite.config.js
src/App.jsx / src/main.jsx / src/index.css
src/context/ThemeContext.jsx
src/data/site.js
src/components/Header.jsx
src/components/Footer.jsx
src/components/ScrollToTop.jsx
src/components/ScrollToTopButton.jsx
src/components/VideoCard.jsx
src/components/VideoModal.jsx
src/pages/Home.jsx
src/pages/Videos.jsx
src/pages/About.jsx
src/pages/Contact.jsx
```

### 커밋 #4 상세 (4개 파일)

```
index.html          — OG·Twitter 메타태그 14줄 추가
package.json        — scripts.og 추가
public/og-image.png — 신규 (1200×630, 235KB)
scripts/generate-og.mjs — 신규
```

---

## 9. 배포 이력 & 검증 결과

| 회차 | 트리거 | 결과 | 확인 항목 |
|:----:|--------|------|-----------|
| 1 | `242fef9` push | ✅ success | HTTP 200, JS·CSS 200 |
| 2 | `2808987` push | ✅ success | HTTP 200 |
| 3 | 수동 dispatch | ✅ success | build_type workflow 전환 후 재배포 |
| 4 | `c526631` push | ✅ success | og-image.png 200, OG 메타태그 14개 확인 |
| 5 | `f77e40e` push | ✅ success | HTTP 200 |

### 라이브 엔드포인트 검증

```
https://ourgrowthpath.github.io/rest04/               → HTTP 200
https://ourgrowthpath.github.io/rest04/og-image.png   → HTTP 200  (235 KB)
og:title      → 성장패스 아카데미 | AI 교육 플랫폼
og:image      → .../rest04/og-image.png
og:image 크기 → 1200 × 630
```

---

## 10. 향후 작업 계획

| 우선순위 | 작업 | 비고 |
|:--------:|------|------|
| 🔴 | 실제 유튜브 영상 ID 교체 | `src/data/site.js` youtubeId 14개 |
| 🔴 | 회사 정보 실제 데이터로 교체 | 이름·주소·연락처·로고 |
| 🟡 | 영상 키워드 검색 | 제목·설명 실시간 필터 |
| 🟡 | Google Analytics 연동 | `gtag.js`, GA4 Measurement ID |
| 🟡 | SEO 강화 | `sitemap.xml`, `robots.txt`, 구조화 데이터 |
| 🟢 | 커스텀 도메인 | GitHub Pages CNAME + DNS 설정 |
| 🟢 | 영상 북마크 | localStorage 기반, 헤더 북마크 아이콘 |
| 🟢 | 다국어 지원 | `i18n` 라이브러리 또는 수동 JSON 관리 |

---

*최종 업데이트: 2026-06-09 — v3*
