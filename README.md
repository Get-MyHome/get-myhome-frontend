# Frontend

## 스택

| 영역 | 선택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 (디자인 토큰 직접 정의) |
| 폰트 | Pretendard Variable (dynamic subset) |
| 아이콘 | SVG → SVGR 로 React 컴포넌트 변환 |
| 서버 상태 | TanStack Query |
| 클라이언트 상태 | Zustand |

컴포넌트 라이브러리는 쓰지 않는다. 디자이너가 정의한 시스템을 그대로 구현한다.

## 실행

```bash
npm install
npm run dev
npm run build
npm run lint
```

`/design-system` 에서 토큰이 디자인 파일과 맞는지 눈으로 확인할 수 있다.

## 구조

```
src/
├─ app/
│  ├─ globals.css       디자인 토큰 전체 (팔레트 · 타이포 · 시맨틱)
│  ├─ layout.tsx        폰트 로드 + Providers
│  ├─ providers.tsx     QueryClientProvider
│  └─ design-system/    토큰 확인용 레퍼런스 페이지
├─ assets/icons/        디자이너가 내보낸 SVG
├─ lib/
│  ├─ query-client.ts   QueryClient 팩토리
│  └─ utils.ts          cn() 헬퍼
└─ types/svg.d.ts       SVG import 타입 선언
```

## 디자인 토큰

`globals.css` 한 파일이 단일 진실 공급원이고 세 층으로 나뉜다.

**1층 팔레트** — 디자인 파일의 원시 색상. 이름을 디자인 파일과 1:1로 맞췄다.
디자이너가 "green-2"라고 하면 코드에서도 `bg-green-2` 다.
Tailwind 기본 팔레트는 `--color-*: initial` 로 제거했으므로 `bg-sky-300` 같은
팔레트 밖 색은 아예 존재하지 않는다.

**2층 타이포그래피** — Mobile 스펙의 size / line-height 쌍.
`text-heading-1`, `text-body-2`, `text-caption-1` 형태로 쓴다.
weight 는 스타일마다 허용치가 여러 개라 고정하지 않았다.
`font-light`(300) / `font-medium`(500) / `font-bold`(700) 를 따로 붙인다.

```tsx
<h1 className="text-heading-1 font-bold">제목</h1>
<p className="text-body-2 font-light text-muted-foreground">본문</p>
```

**3층 시맨틱** — 컴포넌트가 참조하는 역할 이름.
`primary`, `success`, `warning`, `danger`, `info` 와 각각의 `-foreground`,
`-subtle`. **컴포넌트에서는 1층 팔레트를 직접 쓰지 말고 이 층만 쓴다.**
그래야 색이 바뀔 때 컴포넌트를 건드리지 않는다.

```tsx
<span className="bg-danger-subtle text-danger">오류</span>
```

## 아이콘

디자이너가 Figma 에서 내보낸 SVG 를 `src/assets/icons/` 에 넣고 import 한다.

```tsx
import CheckIcon from "@/assets/icons/check.svg";

<CheckIcon className="size-5 text-primary" />
```

SVGR 이 width/height 를 제거하므로 크기는 `size-*`, 색은 `text-*` 로 제어한다.
검정 계열 하드코딩 색은 `currentColor` 로 자동 치환된다 (`next.config.ts` 의
`replaceAttrValues` 참고). 다른 색이 들어오면 그 목록에 추가하면 된다.

## 컨벤션

**서버 상태와 클라이언트 상태를 섞지 않는다.** API 데이터는 TanStack Query 가
캐시·재검증까지 맡는다. Zustand 는 모달 열림 여부, 선택된 탭처럼 서버가 모르는
UI 상태만 담당한다. 양쪽에 두면 동기화 버그가 생긴다.

**컴포넌트 variant 는 CVA 로 정의한다.** `class-variance-authority` 로 variant 를
선언하고 `cn()` 으로 className 을 합친다.
