# 성장패스 아카데미 — 개발일지

> 온라인 AI 교육 플랫폼 **rest04** 프로젝트 전체 개발 기록

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [컬러 팔레트 설계](#3-컬러-팔레트-설계)
4. [프로젝트 구조](#4-프로젝트-구조)
5. [개발 단계별 기록](#5-개발-단계별-기록)
6. [주요 기능 구현 상세](#6-주요-기능-구현-상세)
7. [배포 설정](#7-배포-설정)
8. [커밋 이력](#8-커밋-이력)
9. [향후 작업 계획](#9-향후-작업-계획)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 성장패스 아카데미 (GrowthPath Academy) |
| **리포지토리** | [ourgrowthpath/rest04](https://github.com/ourgrowthpath/rest04) |
| **참조 리포지토리** | [aebonlee/rest03](https://github.com/aebonlee/rest03) |
| **개발 기간** | 2026년 6월 9일 ~ |
| **배포 URL** | https://ourgrowthpath.github.io/rest04/ |
| **목적** | AI 관련 동영상 및 AI 리터러시 교육 콘텐츠를 제공하는 온라인 교육 플랫폼 구축 |

### 기획 요구사항 정리

| # | 요구사항 | 상태 |
|---|---------|------|
| 1 | 주 컬러: 다크블루 + 로열블루 기반, 포인트·보조 컬러 포함 5색 팔레트 | ✅ 완료 |
| 2 | 다크모드 & 라이트모드 전환 지원 | ✅ 완료 |
| 3 | 모바일 완전 최적화 (반응형) | ✅ 완료 |
| 4 | 유튜브 동영상 — 비공개/링크공개 영상 임베드 지원 | ✅ 완료 |
| 5 | 동영상 **2열 × 3행** 그리드 + 페이지네이션 | ✅ 완료 |
| 6 | 주제별 카테고리 메뉴 분리 (AI 동영상 / AI 리터러시) | ✅ 완료 |
| 7 | OG 메타태그 + SNS 공유 미리보기 이미지 | ✅ 완료 |
| 8 | GitHub Actions 자동 빌드·배포 | ✅ 완료 |

---

## 2. 기술 스택

| 분류 | 기술 | 버전 | 선택 이유 |
|------|------|------|-----------|
| UI 프레임워크 | React | 18.3.1 | 컴포넌트 재사용성, SPA 라우팅 |
| 빌드 도구 | Vite | 5.4.8 | 빠른 HMR, 경량 번들 |
| CSS 프레임워크 | Tailwind CSS | 3.4.13 | 유틸리티 퍼스트, 다크모드 지원 |
| 라우팅 | React Router DOM | 6.26.2 | HashRouter (GitHub Pages 호환) |
| 폰트 | Pretendard | CDN | 한국어 최적화 가변 폰트 |
| 이미지 생성 | sharp | 임시 설치 | SVG → PNG 변환 (OG 이미지 생성) |
| 패키지 관리 | npm | 11.x | - |
| 배포 | GitHub Pages + Actions | - | 무료 정적 호스팅 |

### 참조 리포지토리(rest03) 분석 결과

rest03은 건설회사 기업 사이트로 다음 아키텍처를 채택:
- HashRouter 기반 SPA (GitHub Pages 호환)
- `src/data/site.js` 중앙 데이터 관리 패턴
- `section-x` 유틸리티 클래스로 일관된 수평 패딩
- Tailwind `darkMode: 'class'` 방식
- 메가 드롭다운 + 햄버거 모바일 네비게이션

위 패턴을 그대로 차용하되, 교육 플랫폼에 맞게 동영상 중심 구조로 재설계.

---

## 3. 컬러 팔레트 설계

5가지 컬러를 CSS 커스텀 프로퍼티와 Tailwind 확장 컬러로 이중 정의하여 일관성 확보.

| 코드 | 이름 | HEX | 역할 |
|------|------|-----|------|
| C1 | Dark Navy | `#0A1628` | 기본 배경, 다크 요소, OG 이미지 배경 기저 |
| C2 | Royal Blue | `#1E40AF` | 주요 강조색, 버튼, 네비게이션 액티브, OG 배경 그라데이션 종점 |
| C3 | Sky Blue | `#0EA5E9` | 보조 강조색, 다크모드 포인트, OG glow |
| C4 | Teal | `#0D9488` | AI 리터러시 카테고리 배지, 보조 컬러, OG glow |
| C5 | Amber | `#F59E0B` | CTA 포인트, 강조 버튼, OG 액센트 |

```css
/* src/index.css — CSS 커스텀 프로퍼티 */
:root {
  --c1: #0A1628;  /* Dark Navy  */
  --c2: #1E40AF;  /* Royal Blue */
  --c3: #0EA5E9;  /* Sky Blue   */
  --c4: #0D9488;  /* Teal       */
  --c5: #F59E0B;  /* Amber      */
}
```

```js
// tailwind.config.js — brand 네임스페이스 확장
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

홈 페이지에 **컬러 팔레트 가시화 섹션** 추가 — 각 컬러 스와치 + 이름 + HEX 코드 표시.

---

## 4. 프로젝트 구조

```
rest04/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions 자동 배포
├── Dev_log/
│   └── README.md                   # 개발일지 (현재 파일)
├── public/
│   └── og-image.png                # OG 이미지 (1200×630, sharp 생성)
├── scripts/
│   └── generate-og.mjs             # OG 이미지 생성 스크립트 (Node.js)
├── src/
│   ├── main.jsx                    # 앱 진입점 (ThemeProvider + HashRouter)
│   ├── App.jsx                     # 라우팅 설정
│   ├── index.css                   # Tailwind + 커스텀 유틸리티
│   ├── context/
│   │   └── ThemeContext.jsx        # 다크/라이트 모드 전역 상태
│   ├── data/
│   │   └── site.js                 # 중앙 데이터 (회사정보, 동영상, 네비게이션)
│   ├── components/
│   │   ├── Header.jsx              # 고정 헤더, 드롭다운, 햄버거 메뉴, 모드 토글
│   │   ├── Footer.jsx              # 푸터 (회사정보, 링크, 소셜)
│   │   ├── ScrollToTop.jsx         # 라우트 변경 시 스크롤 초기화
│   │   ├── ScrollToTopButton.jsx   # 플로팅 맨위로 버튼
│   │   ├── VideoCard.jsx           # 유튜브 썸네일 + 정보 카드
│   │   └── VideoModal.jsx          # 영상 모달 플레이어 (iframe)
│   └── pages/
│       ├── Home.jsx                # 메인 페이지
│       ├── Videos.jsx              # 동영상 목록 + 페이지네이션
│       ├── About.jsx               # 회사소개 (미션/가치관/연혁)
│       └── Contact.jsx             # 문의하기 폼
├── index.html                      # HTML 진입점 (OG 메타태그 + 다크모드 FOUC 방지)
├── package.json                    # scripts: dev / build / preview / og
├── vite.config.js                  # base: '/rest04/'
├── tailwind.config.js
└── postcss.config.js
```

---

## 5. 개발 단계별 기록

### 5-1. 환경 분석 및 기획 (2026-06-09)

**작업 내용**
- `aebonlee/rest03` 리포지토리 구조·기술 스택 분석
- `ourgrowthpath/rest04` 클론 (README.md만 존재하는 빈 상태 확인)
- 요구사항 정리 및 아키텍처 설계
- 컬러 팔레트 5색 확정

**결정 사항**
- rest03의 React + Vite + Tailwind CSS 스택 그대로 채용
- HashRouter 유지 (GitHub Pages 클라이언트 라우팅 호환)
- 다크모드는 `ThemeContext` + Tailwind `darkMode: 'class'` 조합
- 동영상 데이터는 `site.js`에서 중앙 관리, `youtubeId`만 교체하면 즉시 반영

---

### 5-2. 프로젝트 초기 셋업 (2026-06-09)

**생성 파일**
```
package.json / vite.config.js / tailwind.config.js / postcss.config.js
index.html / .gitignore
```

**주요 설정 포인트**
- `vite.config.js` → `base: '/rest04/'` (GitHub Pages 서브패스 대응)
- `tailwind.config.js` → `darkMode: 'class'`, `brand` 컬러 네임스페이스
- `index.html` → 다크모드 플리커(FOUC) 방지 인라인 스크립트 삽입

```html
<!-- 페이지 로드 전 다크모드 클래스 적용 → FOUC 방지 -->
<script>
  (function () {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

---

### 5-3. 데이터 레이어 설계 (2026-06-09)

**`src/data/site.js` 구조**

```js
company     // 회사 기본정보 (이름, 태그라인, 연락처)
navigation  // 네비게이션 구조 (드롭다운 포함)
features    // 홈 페이지 특장점 카드 데이터
stats       // 홈 페이지 통계 수치
videos      // 유튜브 동영상 목록 (14개, 2개 카테고리)
```

**동영상 데이터 스키마**
```js
{
  id:        Number,
  category:  'ai' | 'ai-literacy',
  title:     String,
  desc:      String,
  youtubeId: String,   // ← 여기만 교체하면 됨
  duration:  String,
  date:      String,
}
```

초기 데이터: AI 동영상 8개 + AI 리터러시 6개 = 총 14개 (예시 영상 ID 포함)

---

### 5-4. 컴포넌트 개발 (2026-06-09)

#### ThemeContext

```jsx
// localStorage 우선 → 시스템 prefers-color-scheme 폴백
const [dark, setDark] = useState(() => {
  const saved = localStorage.getItem('theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})
```

#### Header

- 스크롤 20px 이상 시 배경 불투명도 증가 + 그림자 적용
- 동영상 메뉴: 데스크탑 hover 드롭다운 / 모바일 아코디언
- 햄버거 → X 아이콘 CSS 트랜지션 애니메이션
- 모바일 오버레이 클릭 시 패널 닫기

#### VideoCard

- YouTube 썸네일 API 활용: `https://img.youtube.com/vi/{id}/hqdefault.jpg`
- 썸네일 로드 실패 시 `onError` → `display: none` 처리
- 카테고리별 배지 색상 분기 (AI: Royal Blue / AI 리터러시: Teal)
- 재생 시간(duration) 배지 우하단 고정

#### VideoModal

- `Escape` 키 닫기 지원
- 배경 클릭으로 닫기
- `autoplay=1&rel=0` 파라미터로 관련 동영상 숨김

---

### 5-5. 페이지 개발 (2026-06-09)

#### Home.jsx

| 섹션 | 내용 |
|------|------|
| Hero | 다크 그라데이션 배경, 블러 원형 데코, 그리드 패턴 오버레이, 4개 통계 glass 카드, 스크롤 인디케이터 |
| Color Palette | 5색 팔레트 가시화 (이름 + HEX 코드 스와치) |
| Features | 3개 카드 (전문 AI 교육 / 어디서나 학습 / AI 리터러시) |
| Video Preview | 최신 6개 동영상 3열 그리드, 전체보기 링크 |
| CTA | Amber 버튼 강조, AI 동영상 / AI 리터러시 이중 CTA |

#### Videos.jsx

- URL 파라미터 `/videos/:category` 로 카테고리 상태 관리
- 탭: `전체 / AI 동영상 / AI 리터러시` (각 영상 수 표시)
- **2열 × 3행 = 페이지당 6개** (`sm:grid-cols-2`)
- 페이지네이션: 이전/다음 버튼 + 페이지 번호 버튼
- 페이지 변경 시 300px 위치로 스크롤 복원

#### About.jsx

- 미션 섹션: 텍스트 + 그라데이션 비주얼 박스
- 핵심 가치 4개 카드
- 연혁 타임라인 (수직선 + 연도 원형 배지)

#### Contact.jsx

- 2열 레이아웃 (연락처 정보 + 문의 폼)
- 폼 제출 후 성공 상태 UI 전환
- 재사용 `Field` 컴포넌트

---

### 5-6. GitHub Pages 설정 및 초기 배포 (2026-06-09)

```bash
$ npm run build
✓ 46 modules transformed.
dist/index.html                   1.14 kB │ gzip:  0.69 kB
dist/assets/index-C_fg0tJR.css   37.26 kB │ gzip:  6.47 kB
dist/assets/index-CtA1Qmyz.js   205.10 kB │ gzip: 64.95 kB
✓ built in 1.34s
```

**GitHub Pages 설정 절차**
1. 초기 상태 `build_type: legacy` 확인
2. GitHub REST API `PUT /repos/{owner}/{repo}/pages` — `build_type: workflow` 로 변경
3. 워크플로우 수동 디스패치 → `completed success` 확인

**배포 확인**
```
GET https://ourgrowthpath.github.io/rest04/               → HTTP 200
GET /rest04/assets/index-CtA1Qmyz.js                     → HTTP 200
GET /rest04/assets/index-C_fg0tJR.css                    → HTTP 200
```

---

### 5-7. OG 이미지 생성 및 메타태그 적용 (2026-06-09)

#### 배경

카카오톡·SNS 공유 시 URL 미리보기를 위해 Open Graph 규격을 충족하는 OG 이미지와 메타태그가 필요함.

#### OG 이미지 생성 방식 선택

| 방식 | 장점 | 단점 | 채택 |
|------|------|------|------|
| `canvas` 패키지 | 풍부한 드로잉 API | 네이티브 빌드 의존성, 무거움 | ✗ |
| `sharp` 패키지 | SVG → PNG 변환, 경량, 빠름 | 벡터 드로잉 직접 불가 (SVG 작성 필요) | **✅** |
| 온라인 도구 | 빠른 생성 | 자동화 불가 | ✗ |

`sharp`를 `--no-save` 옵션으로 임시 설치 후, SVG 템플릿을 Node.js 코드로 작성하여 PNG로 변환.

#### 생성 스크립트 (`scripts/generate-og.mjs`)

**SVG 구성 레이어 (하단 → 상단)**

```
① bg gradient        Dark Navy → Navy → Royal Blue (135deg)
② glow1 (radial)     Sky Blue — 우상단 (opacity 0.25)
③ glow2 (radial)     Teal     — 좌하단 (opacity 0.20)
④ glow3 (radial)     Amber    — 중앙하단 (opacity 0.18)
⑤ grid pattern       흰색 격자 (opacity 0.06)
⑥ 원형 장식          우상단 stroke 원 2개 + 좌하단 teal 원
⑦ 좌측 액센트 바     Royal Blue → Teal 그라데이션 세로 바
⑧ GP 로고 박스       Royal Blue 사각형 + "GP" 텍스트
⑨ 브랜드명           "GrowthPath Academy" (Sky Blue, letter-spacing)
⑩ 메인 타이틀        "AI 시대를 이끌어갈 / 디지털 인재 양성" (White, 56px bold)
⑪ 서브 설명          "AI 동영상 · AI 리터러시 온라인 교육 플랫폼" (Gray 300)
⑫ 팔레트 스와치      5색 원형 (C1~C5 순서)
⑬ URL 배지           반투명 pill + "ourgrowthpath.github.io/rest04"
⑭ 우측 카드 패널     반투명 카드 + 특징 3개 텍스트
⑮ Amber 액센트 점    우상단 점 3개
```

**출력 결과**
```
파일: public/og-image.png
크기: 1200 × 630 px
용량: 234.7 KB
```

#### OG 메타태그 적용 (`index.html`)

```html
<!-- Open Graph -->
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

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="성장패스 아카데미 | AI 교육 플랫폼" />
<meta name="twitter:description" content="AI 기술과 AI 리터러시 교육으로 디지털 역량을 키우는 온라인 교육 플랫폼입니다." />
<meta name="twitter:image"       content="https://ourgrowthpath.github.io/rest04/og-image.png" />
```

**Vite `public/` 폴더 전략**

`public/og-image.png` → Vite 빌드 시 `dist/og-image.png` 로 자동 복사. 별도 import 불필요.

#### 배포 후 검증

```
GET /rest04/og-image.png   → HTTP 200  (235 KB)
og:type                    → website
og:site_name               → 성장패스 아카데미
og:url                     → https://ourgrowthpath.github.io/rest04/
og:title                   → 성장패스 아카데미 | AI 교육 플랫폼
og:image                   → https://ourgrowthpath.github.io/rest04/og-image.png
og:image:width/height      → 1200 / 630
```

**카카오 공유 디버거** 검증: https://developers.kakao.com/tool/debugger/sharing

---

## 6. 주요 기능 구현 상세

### 6-1. 다크/라이트 모드

```
흐름: HTML 인라인 스크립트(FOUC 방지)
      → ThemeProvider(초기값: localStorage → 시스템 설정)
      → useEffect(html 클래스 토글 + localStorage 저장)
      → Header 토글 버튼(해 ☀ / 달 🌙 아이콘 전환)
```

Tailwind 유틸리티는 `dark:` prefix로 처리:
```jsx
<body className="bg-white dark:bg-brand-dark text-gray-900 dark:text-gray-100">
```

### 6-2. 유튜브 영상 교체 방법

`src/data/site.js` 의 `youtubeId` 값만 변경:

```js
// 변경 전 (예시)
{ youtubeId: 'aircAruvnKk' }

// 변경 후 (본인 영상 ID로 교체)
{ youtubeId: 'YOUR_VIDEO_ID' }
// https://youtu.be/YOUR_VIDEO_ID → 마지막 11자리가 ID
```

> ⚠️ 비공개 영상은 임베드가 제한될 수 있으니 **"링크로 공개"** 설정 권장.

### 6-3. OG 이미지 재생성 방법

영상·브랜드 정보 변경 시 스크립트를 다시 실행:

```bash
# sharp가 없으면 먼저 임시 설치
npm install --no-save sharp

# OG 이미지 재생성
npm run og

# 결과 확인 후 커밋
git add public/og-image.png
git commit -m "chore: OG 이미지 업데이트"
git push
```

### 6-4. 동영상 카테고리 추가 방법

1. `site.js` `videos` 배열에 `category: 'new-key'` 항목 추가
2. `Videos.jsx` `CATEGORIES` 배열에 `{ key: 'new-key', label: '새 카테고리' }` 추가
3. `navigation` 배열 서브메뉴에 `{ label: '새 카테고리', path: '/videos/new-key' }` 추가

### 6-5. 모바일 최적화 상세

| 화면 너비 | 동영상 그리드 | 네비게이션 |
|-----------|--------------|-----------|
| `< 640px` | 1열 | 햄버거 메뉴 (슬라이드 드로어) |
| `640px ~` | 2열 | 햄버거 메뉴 |
| `1024px ~` | 2열 | 풀 데스크탑 네비게이션 |

---

## 7. 배포 설정

### GitHub Actions 워크플로우 (`.github/workflows/deploy.yml`)

```yaml
on:
  push:
    branches: [main]    # main 푸시 시 자동 배포
  workflow_dispatch:    # 수동 트리거 지원

jobs:
  build:   # npm ci → vite build → upload-pages-artifact
  deploy:  # deploy-pages (build job 완료 후 실행)
```

### 환경 요구사항

- Node.js 20 이상 (로컬 및 CI)
- GitHub Pages: Settings → Pages → Source → **GitHub Actions**

### 로컬 개발 명령어

```bash
npm install            # 의존성 설치
npm run dev            # 개발 서버 (http://localhost:5173/rest04/)
npm run build          # 프로덕션 빌드
npm run preview        # 빌드 결과 로컬 미리보기
npm run og             # OG 이미지 재생성 (sharp 필요)
```

---

## 8. 커밋 이력

| 해시 | 날짜 | 메시지 | 주요 변경 |
|------|------|--------|-----------|
| `efe1587` | 2026-06-09 | Initial commit | README.md |
| `242fef9` | 2026-06-09 | feat: 온라인 AI 교육 사이트 초기 구축 | 전체 소스 23개 파일 |
| `2808987` | 2026-06-09 | docs: 프로젝트 개발일지 작성 | Dev_log/README.md |
| `c526631` | 2026-06-09 | feat: OG 메타태그 및 OG 이미지 추가 | index.html, public/og-image.png, scripts/generate-og.mjs |

---

## 9. 향후 작업 계획

| 우선순위 | 작업 | 설명 | 상태 |
|----------|------|------|------|
| 🔴 높음 | 실제 유튜브 영상 ID 교체 | `src/data/site.js` youtubeId 업데이트 | 대기 |
| 🔴 높음 | 회사 정보 업데이트 | 이름, 주소, 연락처, 로고 이미지 실제 정보로 교체 | 대기 |
| 🟡 중간 | 영상 검색 기능 | 제목/설명 키워드 실시간 필터링 | 대기 |
| 🟡 중간 | 구글 애널리틱스 연동 | `gtag.js` 삽입, 방문자 통계 수집 | 대기 |
| 🟢 낮음 | 커스텀 도메인 연결 | GitHub Pages CNAME 설정 | 대기 |
| 🟢 낮음 | 영상 북마크 기능 | localStorage 기반 클라이언트 저장 | 대기 |
| ✅ 완료 | OG 메타태그 + 이미지 | SNS/카카오 공유 미리보기 | **완료** |
| ✅ 완료 | GitHub Actions 자동 배포 | main 푸시 시 자동 빌드·배포 | **완료** |

---

*최종 업데이트: 2026-06-09*
