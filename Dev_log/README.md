# 성장패스 아카데미 — 개발일지 v6

> **온라인 AI 교육 플랫폼 rest04** · 전체 개발 기록

| 항목 | 내용 |
|------|------|
| 프로젝트 | 성장패스 아카데미 (GrowthPath Academy) |
| 리포지토리 | https://github.com/ourgrowthpath/rest04 |
| 배포 URL | https://ourgrowthpath.github.io/rest04/ |
| 참조 리포 | https://github.com/aebonlee/rest03 |
| 개발 기간 | 2026-06-09 ~ 2026-06-16 |
| 개발일지 버전 | v6 |
| 최종 업데이트 | 2026-06-16 — AI 채팅 위젯 추가 |

---

## 목차

1. [요구사항 & 완료 현황](#1-요구사항--완료-현황)
2. [기술 스택 & 선택 근거](#2-기술-스택--선택-근거)
3. [컬러 팔레트 설계](#3-컬러-팔레트-설계)
4. [전체 파일 구조](#4-전체-파일-구조)
5. [개발 단계별 기록](#5-개발-단계별-기록)
6. [주요 기능 구현 가이드](#6-주요-기능-구현-가이드)
7. [빌드 & 배포 파이프라인](#7-빌드--배포-파이프라인)
8. [OG 미리보기 검증 결과](#8-og-미리보기-검증-결과)
9. [전체 커밋 이력](#9-전체-커밋-이력)
10. [배포 이력](#10-배포-이력)
11. [향후 작업 계획](#11-향후-작업-계획)

> **2026-06-11 업데이트**: Supabase 연동 — 게시판·로그인·카카오 OAuth 추가

---

## 1. 요구사항 & 완료 현황

| # | 요구사항 | 상태 |
|:-:|---------|:----:|
| 1 | 다크블루·로열블루 기반 5색 컬러 팔레트 (CSS 변수 + Tailwind 확장) | ✅ |
| 2 | 다크모드 / 라이트모드 전환 — localStorage 유지, 시스템 설정 자동 감지 | ✅ |
| 3 | 모바일 완전 최적화 — 반응형 그리드, 햄버거 드로어 메뉴 | ✅ |
| 4 | 유튜브 동영상 임베드 — 비공개/링크공개 영상 지원, 모달 재생 | ✅ |
| 5 | 동영상 2열 × 3행 그리드 + 페이지네이션 | ✅ |
| 6 | 주제별 카테고리 메뉴 분리 (AI 동영상 / AI 리터러시) | ✅ |
| 7 | OG 메타태그 6종 + OG 이미지 1200×630 (카카오·SNS 공유 최적화) | ✅ |
| 8 | GitHub Actions 자동 빌드·배포 (main 푸시 시 트리거) | ✅ |
| 9 | 카카오 공유 디버거 OG 미리보기 전항목 검증 | ✅ |
| 10 | Supabase Auth — 이메일/비밀번호 + 카카오 OAuth 로그인 | ✅ |
| 11 | 게시판 (목록·상세·작성·수정·삭제) + 검색 + 페이지네이션 | ✅ |
| 12 | RLS 정책 — 읽기 전체 공개 / 쓰기 로그인 / 수정·삭제 본인글만 | ✅ |

---

## 2. 기술 스택 & 선택 근거

### 프론트엔드

| 기술 | 버전 | 선택 근거 |
|------|------|-----------|
| **React** | 18.3.1 | 컴포넌트 단위 설계, Context API 전역 테마 관리 |
| **Vite** | 5.4.8 | 빠른 HMR, ES 모듈 네이티브, 경량 번들 출력 |
| **Tailwind CSS** | 3.4.13 | 유틸리티 퍼스트, `darkMode: 'class'` 내장 지원 |
| **React Router DOM** | 6.26.2 | HashRouter — GitHub Pages 정적 호스팅 클라이언트 라우팅 |
| **Pretendard** | CDN | 한국어 최적화 가변 폰트, subset 동적 로딩 |

### 백엔드 & 인증

| 기술 | 버전 | 용도 |
|------|------|------|
| **Supabase** | — | DB(PostgreSQL) + Auth + RLS |
| **@supabase/supabase-js** | latest | 클라이언트 SDK |
| **Kakao OAuth** | — | 소셜 로그인 (Supabase Provider 연동) |

### 빌드 & 인프라

| 기술 | 용도 |
|------|------|
| **sharp** | OG 이미지 생성 (SVG → PNG), `--no-save` 임시 설치 |
| **GitHub Actions** | CI/CD — npm ci → vite build → pages 배포 |
| **GitHub Pages** | 정적 호스팅, `build_type: workflow` |
| **GitHub Secrets** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 빌드 시 주입 |

### 참조 리포(rest03) 분석 결론

| 채택 패턴 | 설명 |
|-----------|------|
| `HashRouter` | GitHub Pages 서브패스 클라이언트 라우팅 호환 |
| `src/data/site.js` | 중앙 데이터 관리 — 단일 파일 수정으로 전체 반영 |
| `section-x` 유틸리티 | 일관된 수평 패딩 (`px-4 md:px-10 lg:px-16 xl:px-24`) |
| `darkMode: 'class'` | html 요소 클래스 토글 방식 |

> 교육 플랫폼 특성에 맞게 메가 드롭다운 대신 **카테고리 탭 + 영상 그리드** 구조로 재설계.

---

## 3. 컬러 팔레트 설계

| 코드 | 이름 | HEX | 주요 사용처 |
|:----:|------|:---:|------------|
| **C1** | Dark Navy | `#0A1628` | 배경 베이스, 히어로 그라데이션 시작, OG 배경 기저 |
| **C2** | Royal Blue | `#1E40AF` | 주 강조, 버튼, NavLink 활성, OG 그라데이션 종점 |
| **C3** | Sky Blue | `#0EA5E9` | 보조 강조, 다크모드 포인트, OG Glow, 드롭다운 텍스트 |
| **C4** | Teal | `#0D9488` | AI 리터러시 배지, 타임라인 그라데이션, OG Glow |
| **C5** | Amber | `#F59E0B` | CTA 버튼, 히어로 펄스 점, OG 액센트 |

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
// tailwind.config.js — brand 네임스페이스
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

홈 페이지 **컬러 팔레트 섹션**: 5색 스와치 + 이름 + HEX 시각 표시.

---

## 4. 전체 파일 구조

```
rest04/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD (Supabase secrets 주입)
├── Dev_log/
│   └── README.md                   # 개발일지 (현재 파일)
├── public/
│   └── og-image.png                # OG 이미지 1200×630 (sharp 생성)
├── scripts/
│   └── generate-og.mjs             # OG 이미지 생성 스크립트 (Node.js ESM)
├── supabase/
│   └── schema.sql                  # posts 테이블 + RLS 정책 + 트리거 (재실행 안전)
├── src/
│   ├── main.jsx                    # 진입점 — ThemeProvider + AuthProvider + HashRouter
│   ├── App.jsx                     # 라우팅 설정 (게시판·로그인·보호 라우트 포함)
│   ├── index.css                   # Tailwind base + 커스텀 유틸리티·애니메이션
│   ├── lib/
│   │   └── supabase.js             # Supabase 클라이언트 (env var 기반)
│   ├── context/
│   │   ├── ThemeContext.jsx        # 다크/라이트 전역 상태 (Context + localStorage)
│   │   └── AuthContext.jsx         # 인증 전역 상태 — user·signIn·signUp·signOut·카카오OAuth
│   ├── data/
│   │   └── site.js                 # 중앙 데이터 (게시판 메뉴 추가)
│   ├── components/
│   │   ├── Header.jsx              # 로그인 상태 표시, 사용자 드롭다운, 로그아웃
│   │   ├── ProtectedRoute.jsx      # 비로그인 시 /login 리다이렉트
│   │   ├── Footer.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── ScrollToTopButton.jsx
│   │   ├── VideoCard.jsx
│   │   └── VideoModal.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Videos.jsx
│       ├── About.jsx
│       ├── Contact.jsx
│       ├── Login.jsx               # 이메일/비밀번호 + 카카오 로그인
│       ├── Signup.jsx              # 닉네임·이메일·비밀번호 회원가입
│       ├── Board.jsx               # 게시판 목록 + 검색 + 페이지네이션
│       ├── BoardDetail.jsx         # 게시글 상세 + 수정/삭제 (본인글만)
│       └── BoardWrite.jsx          # 게시글 작성·수정 폼
├── .env.example                    # 환경변수 예시 (VITE_SUPABASE_URL·ANON_KEY)
├── index.html                      # OG·Twitter 메타태그 + FOUC 방지 스크립트
├── package.json
├── vite.config.js                  # base: '/rest04/'
├── tailwind.config.js
└── postcss.config.js
```

---

## 5. 개발 단계별 기록

### 5-1. 참조 리포 분석 (2026-06-09)

- `aebonlee/rest03` GitHub API로 파일 트리 탐색 → 주요 파일 raw 콘텐츠 추출
- 아키텍처 패턴(HashRouter, site.js, section-x, darkMode) 도출
- 교육 플랫폼 특화 구조로 재설계 방향 확정

### 5-2. 프로젝트 셋업 (2026-06-09)

**디렉토리 생성 및 설정 파일**

```bash
git clone https://github.com/ourgrowthpath/rest04.git
mkdir -p src/{components,pages,data,context} .github/workflows scripts public
```

`vite.config.js` → `base: '/rest04/'` (GitHub Pages 서브패스 필수)

`index.html` — FOUC 방지 인라인 스크립트 (React 로드 전 동기 실행):
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

### 5-3. 데이터 레이어 (`src/data/site.js`)

콘텐츠 교체가 단일 파일로 완결되는 중앙 관리 구조.

```js
export const company    // 이름·태그라인·이메일·전화·주소
export const navigation // 메뉴 구조 (드롭다운 children 포함)
export const features   // 홈 특장점 카드 3개
export const stats      // 홈 통계 수치 4개
export const videos     // 동영상 14개 (AI 8 + AI 리터러시 6)
```

**동영상 스키마**
```js
{
  id:        Number,
  category:  'ai' | 'ai-literacy',
  title:     String,
  desc:      String,
  youtubeId: String,   // YouTube 비디오 ID 11자리
  duration:  String,
  date:      String,
}
```

### 5-4. 공통 컴포넌트 (2026-06-09)

**ThemeContext** — 우선순위: `localStorage` → 시스템 `prefers-color-scheme` → 기본 라이트

**Header**
| 기능 | 구현 |
|------|------|
| 스크롤 투명도 | `scrollY > 20` → `backdrop-blur` + `shadow` 동적 적용 |
| 동영상 드롭다운 | 데스크탑: `onMouseEnter/Leave` / 모바일: 아코디언 토글 |
| 햄버거 → X | CSS `before/after` pseudo-element `rotate` 트랜지션 |
| 다크 토글 | `useTheme().toggle()`, 해☀/달🌙 아이콘 조건 렌더 |

**VideoCard** — 썸네일: `img.youtube.com/vi/{id}/hqdefault.jpg`, `onError` → `display:none`

**VideoModal** — `autoplay=1&rel=0`, ESC 키·배경 클릭 닫기, `body overflow: hidden`

### 5-5. 페이지 개발 (2026-06-09)

**Home** — Hero(그라데이션 + glass 통계 카드) · 팔레트 섹션 · Features · 영상 미리보기 6개 · CTA

**Videos** — URL 파라미터 카테고리 라우팅 · `PER_PAGE = 6` (2열×3행) · 페이지네이션 · VideoModal

**About** — 미션(2열 그리드) · 핵심 가치 4카드 · 연혁 타임라인(수직선 + 원형 배지)

**Contact** — 연락처 아이콘 카드 3개 · 문의 폼 + 제출 성공 UI 전환

### 5-6. 초기 빌드 & 배포 (2026-06-09)

```
✓ 46 modules transformed.
dist/index.html                  1.14 kB  (gzip 0.69 kB)
dist/assets/index-C_fg0tJR.css  37.26 kB (gzip 6.47 kB)
dist/assets/index-CtA1Qmyz.js  205.10 kB (gzip 64.95 kB)
built in 1.34s
```

GitHub Pages `build_type: legacy` → `workflow` 전환 (REST API `PUT /pages`).

### 5-7. OG 이미지 생성 (2026-06-09)

**도구 선택**: `sharp` (`--no-save` 임시 설치) — SVG 템플릿 → PNG 변환

**SVG 레이어 17단** (하단→상단)
```
 1  bg gradient    Dark Navy → Navy → Royal Blue (135°)
 2  glow sky       radial 우상단 0.25
 3  glow teal      radial 좌하단 0.20
 4  glow amber     radial 중앙하단 0.18
 5  grid pattern   60px 격자 stroke 0.06
 6  circle deco    우상단 stroke 원 2개
 7  circle deco    좌하단 teal stroke 원
 8  accent bar     좌측 세로 바 Royal Blue→Teal 그라데이션
 9  GP logo box    Royal Blue 사각형 + "GP"
10  brand name     "GrowthPath Academy"  (Sky Blue)
11  title line 1   "AI 시대를 이끌어갈"  (White 56px)
12  title line 2   "디지털 인재 양성"    (White 56px)
13  subtitle       "AI 동영상 · AI 리터러시 온라인 교육 플랫폼"
14  palette dots   C1~C5 원형 스와치 5개
15  url badge      반투명 pill + URL 텍스트
16  right card     반투명 패널 + 특징 3개
17  amber dots     우상단 액센트 점 3개
```

출력: `public/og-image.png` · 1200×630 px · 235 KB

### 5-8. OG 메타태그 적용 (2026-06-09)

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

`public/og-image.png` → Vite 빌드 시 `dist/og-image.png` 자동 복사.

### 5-10. Supabase 연동 — 인증 & 게시판 (2026-06-11)

#### 추가된 패키지

```bash
npm install @supabase/supabase-js
```

#### Supabase 설정

| 항목 | 내용 |
|------|------|
| 프로젝트 URL | `https://vhxvqtbemahbcbrbnkcv.supabase.co` |
| Auth Provider | 이메일/비밀번호 + 카카오 OAuth |
| 카카오 Redirect URI | `https://vhxvqtbemahbcbrbnkcv.supabase.co/auth/v1/callback` |

#### posts 테이블 스키마

```sql
CREATE TABLE public.posts (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  content     TEXT NOT NULL,
  author_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  views       INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### RLS 정책

| 정책명 | 작업 | 조건 |
|--------|------|------|
| `posts_select_all` | SELECT | 전체 공개 |
| `posts_insert_auth` | INSERT | 로그인 사용자 (`auth.uid() = author_id`) |
| `posts_update_own` | UPDATE | 본인글만 (`auth.uid() = author_id`) |
| `posts_delete_own` | DELETE | 본인글만 (`auth.uid() = author_id`) |

`updated_at` 자동 갱신 트리거 포함.  
`supabase/schema.sql`은 `DROP POLICY/TRIGGER IF EXISTS`를 사용해 재실행 안전.

#### 인증 흐름

```
AuthContext (전역)
  ├── signIn(email, password)       → supabase.auth.signInWithPassword
  ├── signUp(email, password, name) → supabase.auth.signUp + display_name 메타데이터
  ├── signInWithKakao()             → supabase.auth.signInWithOAuth({ provider: 'kakao' })
  └── signOut()                     → supabase.auth.signOut

ProtectedRoute
  └── user 없으면 /login 으로 리다이렉트 (state.from 보존 → 로그인 후 원래 페이지로 복귀)
```

#### 게시판 기능

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/board` | `Board.jsx` | 목록 (15개/페이지) + 제목·내용 검색 + URL 쿼리 파라미터 페이지네이션 |
| `/board/:id` | `BoardDetail.jsx` | 상세 보기 + 조회수 자동 증가 + 본인글 수정·삭제 |
| `/board/write` | `BoardWrite.jsx` | 작성 (로그인 필요) |
| `/board/edit/:id` | `BoardWrite.jsx` | 수정 (작성자 본인 검증 후 진입) |

#### GitHub Actions 환경변수

빌드 시 아래 GitHub Secrets 값이 주입됨:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

> Secrets 등록 위치: `github.com/ourgrowthpath/rest04` → Settings → Secrets and variables → Actions

### 5-9. 카카오 디버거 OG 검증 (2026-06-09)

배포된 `index.html`을 직접 파싱하여 14개 메타태그 전항목 및 이미지 응답 확인.
→ 상세 결과는 [§8 OG 미리보기 검증 결과](#8-og-미리보기-검증-결과) 참조.

---

## 6. 주요 기능 구현 가이드

### 유튜브 영상 교체

`src/data/site.js` 의 `youtubeId` 값만 변경 후 커밋:

```js
// https://youtu.be/ABC123defGH → 마지막 11자리
{ youtubeId: 'ABC123defGH' }
```

> ⚠️ **비공개 영상**은 임베드 불가 — YouTube에서 **"링크로 공개"** 설정 필요.

### OG 이미지 재생성

```bash
npm install --no-save sharp   # 미설치 시
npm run og                    # public/og-image.png 재생성
git add public/og-image.png && git commit -m "chore: OG 이미지 업데이트" && git push
```

### 동영상 카테고리 추가

```js
// 1) site.js — videos 배열
{ ..., category: 'prompt' }

// 2) site.js — navigation 서브메뉴
{ label: '프롬프트 엔지니어링', path: '/videos/prompt', desc: '...' }
```
```jsx
// 3) Videos.jsx — CATEGORIES 배열
{ key: 'prompt', label: '프롬프트 엔지니어링' }
```

### 다크모드 흐름

```
index.html 인라인 스크립트 (동기, FOUC 방지)
  ↓ React 마운트
ThemeProvider (localStorage → 시스템 → 기본 라이트)
  ↓ dark state 변경
useEffect → html.classList.toggle('dark') + localStorage 저장
  ↓
모든 dark: 접두사 유틸리티 즉시 적용
```

---

## 7. 빌드 & 배포 파이프라인

### GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    steps:
      - actions/checkout@v4
      - actions/setup-node@v4  # Node 20, npm cache
      - run: npm ci
      - run: npm run build
      - actions/upload-pages-artifact@v3  # dist/

  deploy:
    needs: build
    environment: github-pages
    steps:
      - actions/deploy-pages@v4
```

### 로컬 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 → http://localhost:5173/rest04/
npm run build        # 프로덕션 빌드 → dist/
npm run preview      # 빌드 결과 로컬 확인
npm run og           # OG 이미지 재생성
```

### 최신 빌드 출력

```
dist/index.html                  2.25 kB  (gzip  1.02 kB)
dist/assets/index-C_fg0tJR.css  37.26 kB (gzip  6.47 kB)
dist/assets/index-CtA1Qmyz.js  205.10 kB (gzip 64.95 kB)
dist/og-image.png               234.7  KB (public/ 자동 복사)
```

---

## 8. OG 미리보기 검증 결과

검증 방법: 배포된 `https://ourgrowthpath.github.io/rest04/` HTML을 직접 파싱  
검증 도구: curl + Node.js 정규식 파싱 · sharp 픽셀 검증  
카카오 디버거: https://developers.kakao.com/tool/debugger/sharing

### Open Graph 태그 14종 전항목 ✅

| 태그 | 값 | 상태 |
|------|---|:----:|
| `og:url` | `https://ourgrowthpath.github.io/rest04/` | ✅ |
| `og:title` | 성장패스 아카데미 \| AI 교육 플랫폼 | ✅ |
| `og:description` | AI 기술과 AI 리터러시 교육으로 디지털 역량을 키우는 온라인 교육 플랫폼입니다. | ✅ |
| `og:type` | `website` | ✅ |
| `og:image` | `https://ourgrowthpath.github.io/rest04/og-image.png` | ✅ |
| `og:image:width` | `1200` | ✅ |
| `og:image:height` | `630` | ✅ |
| `og:image:alt` | 성장패스 아카데미 — AI 시대를 이끌어갈 디지털 인재 양성 | ✅ |
| `og:site_name` | 성장패스 아카데미 | ✅ |
| `og:locale` | `ko_KR` | ✅ |
| `twitter:card` | `summary_large_image` | ✅ |
| `twitter:title` | 성장패스 아카데미 \| AI 교육 플랫폼 | ✅ |
| `twitter:description` | AI 기술과 AI 리터러시 교육으로 디지털 역량을 키우는 온라인 교육 플랫폼입니다. | ✅ |
| `twitter:image` | `https://ourgrowthpath.github.io/rest04/og-image.png` | ✅ |

### OG 이미지 규격 검증 ✅

| 항목 | 결과 | 기준 |
|------|------|------|
| HTTP 응답 | **200 OK** | — |
| 파일 크기 | **235 KB** | 8 MB 이하 권장 ✅ |
| 픽셀 크기 | **1200 × 630 px** | 800×400 이상 권장 ✅ |
| 비율 | **1.905:1** | 1.91:1 권장 ✅ |
| MIME 타입 | **image/png** | — |

카카오 디버거 입력 URL: `https://ourgrowthpath.github.io/rest04/`

---

## 9. 전체 커밋 이력

| # | 해시 | 날짜 | 메시지 | 파일 |
|:-:|------|------|--------|:----:|
| 1 | `efe1587` | 2026-06-09 | Initial commit | 1 |
| 2 | `242fef9` | 2026-06-09 | feat: 온라인 AI 교육 사이트 초기 구축 | 23 |
| 3 | `2808987` | 2026-06-09 | docs: 프로젝트 개발일지 작성 | 1 |
| 4 | `c526631` | 2026-06-09 | feat: OG 메타태그 및 OG 이미지 추가 | 4 |
| 5 | `f77e40e` | 2026-06-09 | docs: 개발일지 전면 업데이트 | 1 |
| 6 | `e4b2188` | 2026-06-09 | docs: 개발일지 v3 — 전체 작업 완결 형태로 재편 | 1 |
| 7 | `fdb3735` | 2026-06-09 | docs: 개발일지 v4 — OG 검증 결과 추가 | 1 |
| 8 | `d525f48` | 2026-06-11 | feat: 게시판 및 로그인 기능 구현 (Supabase 연동) | 18 |
| 9 | `970d5c7` | 2026-06-11 | fix: schema.sql 재실행 안전 버전으로 업데이트 | 1 |
| 10 | `36e8b38` | 2026-06-11 | docs: 개발일지 v5 — Supabase 연동 작업 기록 추가 | 1 |
| 11 | *(이번)* | 2026-06-11 | fix: 카카오 OAuth 스코프 profile_nickname으로 수정 | 2 |

**커밋 #2 포함 파일 목록 (23개)**
```
.github/workflows/deploy.yml · .gitignore · index.html
package.json · package-lock.json · postcss.config.js
tailwind.config.js · vite.config.js
src/App.jsx · src/main.jsx · src/index.css
src/context/ThemeContext.jsx · src/data/site.js
src/components/Header.jsx · Footer.jsx · ScrollToTop.jsx
src/components/ScrollToTopButton.jsx · VideoCard.jsx · VideoModal.jsx
src/pages/Home.jsx · Videos.jsx · About.jsx · Contact.jsx
```

**커밋 #4 포함 파일 목록 (4개)**
```
index.html (OG·Twitter 메타태그 14줄 추가)
package.json (scripts.og 추가)
public/og-image.png (신규, 1200×630, 235 KB)
scripts/generate-og.mjs (신규)
```

---

## 10. 배포 이력

| 회차 | 커밋 | 트리거 | 결과 | 주요 내용 |
|:----:|------|--------|:----:|-----------|
| 1 | `242fef9` | push | ✅ | 사이트 초기 배포, 전체 소스 |
| 2 | `2808987` | push | ✅ | 개발일지 v1 추가 |
| 3 | — | 수동 dispatch | ✅ | `build_type: workflow` 전환 후 재배포 |
| 4 | `c526631` | push | ✅ | OG 이미지·메타태그 적용 |
| 5 | `f77e40e` | push | ✅ | 개발일지 v2 업데이트 |
| 6 | `e4b2188` | push | ✅ | 개발일지 v3 재편 |
| 7 | `fdb3735` | push | ✅ | 개발일지 v4 — OG 검증 결과 추가 |
| 8 | `d525f48` | push | ✅ | Supabase 연동 — 게시판·로그인·카카오 OAuth |
| 9 | `970d5c7` | push | ✅ | schema.sql 안전 버전 업데이트 |
| 10 | `36e8b38` | push | ✅ | 개발일지 v5 |
| 11 | *(이번)* | push | 🔄 | 카카오 OAuth 스코프 수정 (KOE205 해결) |

**라이브 엔드포인트 최종 상태**
```
https://ourgrowthpath.github.io/rest04/             → HTTP 200
https://ourgrowthpath.github.io/rest04/og-image.png → HTTP 200 (235 KB)
```

---

## 11. 향후 작업 계획

| 우선순위 | 작업 | 내용 |
|:--------:|------|------|
| 🔴 | GitHub Secrets 등록 | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` → Actions 탭에서 빌드 재실행 |
| 🔴 | 실제 유튜브 영상 ID 교체 | `src/data/site.js` youtubeId 14개 실제 영상으로 업데이트 |
| 🔴 | 회사 정보 실제 데이터 교체 | 이름·주소·연락처·로고 이미지 |
| 🟡 | 영상 키워드 검색 | 제목·설명 실시간 필터링 |
| 🟡 | Google Analytics 연동 | GA4 `gtag.js` 삽입 |
| 🟡 | SEO 강화 | `sitemap.xml`, `robots.txt`, JSON-LD 구조화 데이터 |
| 🟡 | 게시판 댓글 기능 | `comments` 테이블 + 게시글 하단 댓글 영역 |
| 🟢 | 커스텀 도메인 | GitHub Pages CNAME + DNS 레코드 |
| 🟢 | 영상 북마크 | localStorage 저장, 헤더 북마크 아이콘 |

---

### 5-11. 카카오 OAuth 스코프 수정 (2026-06-11)

#### 문제
개인 개발자 앱은 카카오 이메일(`account_email`) 스코프 사용 불가.  
로그인 시 **KOE205** 에러 발생 (`Unsupported provider: provider is not enabled` 포함).

#### 원인
Supabase의 카카오 OAuth 기본 설정이 `account_email` 스코프를 요청하는데,  
개인 개발자 앱은 해당 스코프가 비활성 상태라 카카오 측에서 차단.

#### 수정 내용 (`src/context/AuthContext.jsx`)

```js
// 수정 전
supabase.auth.signInWithOAuth({
  provider: 'kakao',
  options: { redirectTo: window.location.origin },
})

// 수정 후
supabase.auth.signInWithOAuth({
  provider: 'kakao',
  options: {
    redirectTo: window.location.origin,
    scopes: 'profile_nickname',   // account_email 제거
  },
})
```

`profile_nickname` 스코프만 요청 → 닉네임으로 `displayName` 표시.  
이메일 없이 로그인 가능, KOE205 에러 해소.

---

### 5-12. 메인페이지 AI 채팅 위젯 (2026-06-16)

#### 요구사항
메인페이지 우측 하단에 채팅 팝업을 띄우고, **Solar(Upstage) API**로 방문자 질문에
답변. Solar 실패 시 **OpenAI**로 폴백. API 키는 **Supabase에 저장**하여 사용.

#### 설계 결정
| 항목 | 결정 | 이유 |
|------|------|------|
| 키 호출 위치 | **Supabase Edge Function** | GitHub Pages(정적 호스팅)에서 브라우저가 직접 키를 쓰면 키가 노출됨. 함수가 서버 측에서 대신 호출 |
| 키 저장 | Supabase **Secrets**(env) | DB 테이블이 아닌 시크릿으로 보관 → 브라우저 비노출 |
| 모델 우선순위 | **Solar 메인 → OpenAI 폴백** | 한국어 강점의 Solar 우선, 실패 시 OpenAI 대체 |
| 이용 권한 | 모든 방문자 | `verify_jwt = false`로 비로그인 호출 허용 |

#### 구성 요소
- **`src/components/ChatWidget.jsx`** — 우측 하단 런처 버튼 + 팝업 패널. 메시지 목록,
  입력창(Enter 전송 / Shift+Enter 줄바꿈), 타이핑 인디케이터, 다크모드 대응.
  기존 supabase 클라이언트의 `functions.invoke('syu-chat', …)`로 호출(프론트 신규 env 불필요).
- **`supabase/functions/syu-chat/index.ts`** — Deno Edge Function. CORS 처리, 시스템
  프롬프트 주입, Solar 우선 호출 후 실패 시 OpenAI 폴백, 진입/실패 로그 출력.
- **`supabase/config.toml`** — `[functions.syu-chat] verify_jwt = false`.
- **`src/pages/Home.jsx`** — `<ChatWidget />` 추가. 겹침 방지로 `ScrollToTopButton`을
  `bottom-6` → `bottom-24`로 이동.

#### Edge Function 환경변수 (Supabase Secrets)
| 변수 | 기본값 |
|------|--------|
| `SOLAR_API_KEY` | (필수) |
| `OPENAI_API_KEY` | (폴백용, 선택) |
| `SOLAR_API_URL` | `https://api.upstage.ai/v1/chat/completions` |
| `SOLAR_MODEL` | `solar-pro2` |
| `OPENAI_MODEL` | `gpt-4o-mini` |

#### 배포 절차
```bash
npx supabase link --project-ref vhxvqtbemahbcbrbnkcv   # 프론트와 동일 프로젝트
npx supabase secrets set SOLAR_API_KEY="..." OPENAI_API_KEY="..."
npx supabase functions deploy syu-chat
```
> 프론트엔드(GitHub Pages)는 push 시 자동 배포되지만, **Edge Function은 위 명령으로 별도 배포**가 필요하다.

#### 트러블슈팅 기록
- **증상:** 채팅은 열리고 전송되나 "답변을 가져오지 못했어요" 표시.
- **원인:** ① 코드가 `chat`을 invoke했으나 배포 함수명은 `syu-chat`(불일치). ② 프론트가 쓰는 프로젝트(`vhxvqtbemahbcbrbnkcv`)에 함수 미배포(`NOT_FOUND`).
- **조치:** invoke 대상·함수 폴더·config를 `syu-chat`으로 통일, invoke 실패 시 `error.context`(HTTP status·body)를 콘솔 출력하도록 로깅 보강, 함수 진입부 로그 추가. 동일 프로젝트로 `functions deploy syu-chat` 재배포.

---

*개발일지 v6 — 최종 업데이트: 2026-06-16*
