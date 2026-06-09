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
8. [향후 작업 계획](#8-향후-작업-계획)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 성장패스 아카데미 (GrowthPath Academy) |
| **리포지토리** | [ourgrowthpath/rest04](https://github.com/ourgrowthpath/rest04) |
| **참조 리포지토리** | [aebonlee/rest03](https://github.com/aebonlee/rest03) |
| **개발 기간** | 2026년 6월 9일 |
| **배포 URL** | https://ourgrowthpath.github.io/rest04/ |
| **목적** | AI 관련 동영상 및 AI 리터러시 교육 콘텐츠를 제공하는 온라인 교육 플랫폼 구축 |

### 기획 요구사항 정리

- 주 컬러 : 다크블루 + 로열블루 기반, 포인트·보조 컬러 포함 5색 팔레트
- 다크모드 & 라이트모드 전환 지원
- 모바일 완전 최적화 (반응형)
- 유튜브 동영상 — 비공개/링크공개 영상 임베드 지원
- 동영상 **2열 × 3행** 그리드 + 페이지네이션
- 주제별 카테고리 메뉴 분리 (AI 동영상 / AI 리터러시)

---

## 2. 기술 스택

| 분류 | 기술 | 버전 | 선택 이유 |
|------|------|------|-----------|
| UI 프레임워크 | React | 18.3.1 | 컴포넌트 재사용성, SPA 라우팅 |
| 빌드 도구 | Vite | 5.4.8 | 빠른 HMR, 경량 번들 |
| CSS 프레임워크 | Tailwind CSS | 3.4.13 | 유틸리티 퍼스트, 다크모드 지원 |
| 라우팅 | React Router DOM | 6.26.2 | HashRouter (GitHub Pages 호환) |
| 폰트 | Pretendard | CDN | 한국어 최적화 가변 폰트 |
| 패키지 관리 | npm | - | - |
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
| C1 | Dark Navy | `#0A1628` | 기본 배경, 다크 요소 |
| C2 | Royal Blue | `#1E40AF` | 주요 강조색, 버튼, 네비게이션 액티브 |
| C3 | Sky Blue | `#0EA5E9` | 보조 강조색, 다크모드 포인트 |
| C4 | Teal | `#0D9488` | AI 리터러시 카테고리 배지, 보조 컬러 |
| C5 | Amber | `#F59E0B` | CTA 포인트, 강조 버튼, 히어로 점 애니메이션 |

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

홈 페이지 하단에 **컬러 팔레트 가시화 섹션** 추가 — 각 컬러 스와치와 HEX 코드 표시.

---

## 4. 프로젝트 구조

```
rest04/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 자동 배포
├── Dev_log/
│   └── README.md               # 개발일지 (현재 파일)
├── src/
│   ├── main.jsx                # 앱 진입점 (ThemeProvider + HashRouter)
│   ├── App.jsx                 # 라우팅 설정
│   ├── index.css               # Tailwind + 커스텀 유틸리티
│   ├── context/
│   │   └── ThemeContext.jsx    # 다크/라이트 모드 전역 상태
│   ├── data/
│   │   └── site.js             # 중앙 데이터 (회사정보, 동영상, 네비게이션)
│   ├── components/
│   │   ├── Header.jsx          # 고정 헤더, 드롭다운, 햄버거 메뉴, 모드 토글
│   │   ├── Footer.jsx          # 푸터 (회사정보, 링크, 소셜)
│   │   ├── ScrollToTop.jsx     # 라우트 변경 시 스크롤 초기화
│   │   ├── ScrollToTopButton.jsx # 플로팅 맨위로 버튼
│   │   ├── VideoCard.jsx       # 유튜브 썸네일 + 정보 카드
│   │   └── VideoModal.jsx      # 영상 모달 플레이어 (iframe)
│   └── pages/
│       ├── Home.jsx            # 메인 페이지
│       ├── Videos.jsx          # 동영상 목록 + 페이지네이션
│       ├── About.jsx           # 회사소개 (미션/가치관/연혁)
│       └── Contact.jsx         # 문의하기 폼
├── index.html                  # HTML 진입점 (다크모드 플리커 방지 스크립트 포함)
├── package.json
├── vite.config.js              # base: '/rest04/'
├── tailwind.config.js
└── postcss.config.js
```

---

## 5. 개발 단계별 기록

### 5-1. 환경 분석 및 기획 (Day 1 — 2026-06-09)

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

### 5-2. 프로젝트 초기 셋업 (Day 1 — 2026-06-09)

**생성 파일**
```
package.json / vite.config.js / tailwind.config.js / postcss.config.js
index.html / .gitignore
```

**주요 설정 포인트**
- `vite.config.js` → `base: '/rest04/'` (GitHub Pages 서브패스 대응)
- `tailwind.config.js` → `darkMode: 'class'`, `brand` 컬러 네임스페이스
- `index.html` → 다크모드 플리커 방지 인라인 스크립트 삽입

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

### 5-3. 데이터 레이어 설계 (Day 1 — 2026-06-09)

**`src/data/site.js` 구조**

```js
company  // 회사 기본정보 (이름, 태그라인, 연락처)
navigation  // 네비게이션 구조 (드롭다운 포함)
features // 홈 페이지 특장점 카드 데이터
stats    // 홈 페이지 통계 수치
videos   // 유튜브 동영상 목록 (14개, 2개 카테고리)
```

**동영상 데이터 스키마**
```js
{
  id: Number,
  category: 'ai' | 'ai-literacy',
  title: String,
  desc: String,
  youtubeId: String,   // ← 여기만 교체하면 됨
  duration: String,
  date: String,
}
```

초기 데이터: AI 동영상 8개 + AI 리터러시 6개 = 총 14개 (예시 영상 ID 포함)

---

### 5-4. 컴포넌트 개발 (Day 1 — 2026-06-09)

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

### 5-5. 페이지 개발 (Day 1 — 2026-06-09)

#### Home.jsx

| 섹션 | 내용 |
|------|------|
| Hero | 다크 그라데이션 배경, 블러 원형 데코, 그리드 패턴 오버레이, 4개 통계 glass 카드 |
| Color Palette | 5색 팔레트 가시화 (이름 + HEX) |
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

### 5-6. 빌드 및 배포 (Day 1 — 2026-06-09)

```bash
$ npm run build
✓ 46 modules transformed.
dist/index.html                   1.14 kB │ gzip:  0.69 kB
dist/assets/index-C_fg0tJR.css   37.26 kB │ gzip:  6.47 kB
dist/assets/index-CtA1Qmyz.js   205.10 kB │ gzip: 64.95 kB
✓ built in 1.34s
```

**GitHub Pages 설정**
- 초기 상태 `build_type: legacy` 확인
- GitHub REST API `PUT /repos/{owner}/{repo}/pages` 로 `build_type: workflow` 변경
- 워크플로우 수동 디스패치 → 배포 완료 확인

**배포 워크플로우 (`deploy.yml`)**
```yaml
on:
  push:
    branches: [main]   # main 푸시 시 자동 배포
  workflow_dispatch:   # 수동 트리거 지원
```

**배포 확인**
```
GET https://ourgrowthpath.github.io/rest04/          → 200 OK
GET /rest04/assets/index-CtA1Qmyz.js                → 200 OK
GET /rest04/assets/index-C_fg0tJR.css               → 200 OK
```

---

## 6. 주요 기능 구현 상세

### 6-1. 다크/라이트 모드

```
흐름: HTML 인라인 스크립트(FOUC 방지)
      → ThemeProvider(초기값 결정)
      → useEffect(html 클래스 토글 + localStorage 저장)
      → Header 토글 버튼(해/달 아이콘 전환)
```

Tailwind 유틸리티는 `dark:` prefix로 처리:
```jsx
// 예시
<body className="bg-white dark:bg-brand-dark text-gray-900 dark:text-gray-100">
```

### 6-2. 유튜브 영상 교체 방법

`src/data/site.js` 의 `youtubeId` 값만 변경:

```js
// 변경 전
{ youtubeId: 'aircAruvnKk' }

// 변경 후 (본인 영상 ID로 교체)
{ youtubeId: 'YOUR_VIDEO_ID' }
// https://youtu.be/YOUR_VIDEO_ID 에서 마지막 11자리
```

비공개/링크공개 영상도 동일하게 적용. 단, 비공개 설정 영상은 임베드가 제한될 수 있으므로 **"링크 공개"** 설정 권장.

### 6-3. 동영상 카테고리 추가 방법

1. `site.js` `videos` 배열에 `category: 'new-category'` 추가
2. `Videos.jsx` `CATEGORIES` 배열에 `{ key: 'new-category', label: '새 카테고리' }` 추가
3. `navigation` 에 서브메뉴 항목 추가

### 6-4. 모바일 최적화 상세

| 화면 너비 | 동영상 그리드 | 헤더 |
|-----------|--------------|------|
| < 640px   | 1열 | 햄버거 메뉴 |
| 640px~    | 2열 | 햄버거 메뉴 |
| 1024px~   | 2열 (최대) | 풀 네비게이션 |

---

## 7. 배포 설정

### GitHub Actions 워크플로우

```yaml
# .github/workflows/deploy.yml
jobs:
  build:   # npm ci → vite build → upload-pages-artifact
  deploy:  # deploy-pages (build 완료 후)
```

### 환경 요구사항

- Node.js 20 이상
- GitHub Pages : Settings → Pages → Source → **GitHub Actions**

### 로컬 개발 명령어

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 실행 (http://localhost:5173/rest04/)
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

---

## 8. 향후 작업 계획

| 우선순위 | 작업 | 설명 |
|----------|------|------|
| 🔴 높음 | 실제 유튜브 영상 ID 교체 | `src/data/site.js` youtubeId 업데이트 |
| 🔴 높음 | 회사 정보 업데이트 | 이름, 주소, 연락처, 로고 이미지 |
| 🟡 중간 | 검색 기능 | 영상 제목/설명 키워드 검색 |
| 🟡 중간 | OG 메타태그 | SNS 공유 미리보기 이미지 설정 |
| 🟢 낮음 | 구글 애널리틱스 연동 | 방문자 통계 수집 |
| 🟢 낮음 | 커스텀 도메인 연결 | GitHub Pages CNAME 설정 |
| 🟢 낮음 | 영상 좋아요/북마크 | localStorage 기반 클라이언트 저장 |

---

*최종 업데이트: 2026-06-09*
