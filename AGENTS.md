<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 프로젝트 규칙

이 아래는 팀 규칙이다. 위 블록은 `next dev` 가 자동 생성/갱신하는 영역이므로
건드리지 말고, 규칙은 항상 마커 바깥인 이 아래에 추가한다.

## 작업 범위

**요청하지 않은 것을 만들지 않는다.** 스펙에 없는 영역을 발견하면 임의로 채우지
말고 "이 부분은 스펙에 없다"고 알린다. 만들지 말지는 사람이 정한다.

- 디자인 스펙에 없는 값을 추정해서 넣지 않는다. 다크 테마, 데스크톱 타이포
  스케일, 팔레트에 없는 색상 단계 같은 것. "임시", "참고용" 주석을 달아도
  마찬가지다. 코드에 들어가는 순간 디자인 시스템의 일부처럼 굳어지고, 실제
  스펙이 나왔을 때 충돌한다.
- 요청 없이 라이브러리를 추가하지 않는다.
- 파일을 지울지 남길지 애매하면 물어본다.

## 디자인 시스템

디자이너가 정의한 시스템을 그대로 구현한다. **컴포넌트 라이브러리를 설치하지
않는다** (shadcn/ui, MUI, Chakra, Ant Design 등). 필요한 컴포넌트는 디자인
스펙에 맞춰 직접 만든다.

모든 토큰은 `src/app/globals.css` 한 파일에 있고 세 층으로 나뉜다.
1층 팔레트 · 2층 타이포그래피 · 3층 시맨틱.

### 색상

- 컴포넌트에서는 **시맨틱 토큰만** 쓴다. `bg-primary`, `text-danger`,
  `bg-success-subtle`, `text-muted-foreground`.
- 팔레트 토큰(`bg-green-2`, `text-neutral-400`)은 globals.css 3번 블록에서
  시맨틱 토큰을 정의할 때만 쓴다. 컴포넌트에 직접 등장하면 안 된다.
  그래야 색이 바뀔 때 컴포넌트를 건드리지 않는다.
- Tailwind 기본 팔레트는 `--color-*: initial` 로 제거돼 있다.
  `bg-sky-300`, `text-slate-700` 같은 클래스는 존재하지 않는다.
- **임의값을 쓰지 않는다.** `bg-[#08875D]`, `text-[rgb(...)]` 금지.
  필요한 색이 팔레트에 없으면 임의로 만들지 말고 디자이너에게 요청한다.

### 타이포그래피

- 크기는 정의된 스케일만 쓴다.
  `text-heading-1~3`, `text-subtitle-1~5`, `text-body-1~3`, `text-caption-1~2`.
- `text-lg`, `text-2xl`, `text-[18px]` 를 쓰지 않는다.
- 스케일 토큰은 size 와 line-height 만 정한다. 굵기는 `font-light`(300),
  `font-medium`(500), `font-bold`(700) 를 따로 붙인다.
- letter-spacing 은 전 스타일 0 이다. `tracking-*` 유틸리티를 쓰지 않는다.
- 현재 스케일은 Mobile 스펙이다. 데스크톱 값은 아직 없으므로 브레이크포인트별
  타이포를 임의로 만들지 말고 디자이너에게 요청한다.

### 아이콘

- `src/assets/icons/*.svg` 를 import 하면 React 컴포넌트가 된다.
  `import CheckIcon from "@/assets/icons/check.svg"`
- 크기는 `size-*`, 색은 `text-*` 로 제어한다. SVG 파일이나 JSX 에
  `width` / `height` / `fill` 을 직접 넣지 않는다.
- 아이콘 라이브러리(lucide, react-icons 등)를 설치하지 않는다.
  디자이너가 내보낸 SVG 를 쓴다.

## 상태 관리

- **서버에서 온 데이터는 TanStack Query** 가 맡는다. 캐시, 재검증, 중복 요청
  제거까지 포함한다.
- **Zustand 는 서버가 모르는 UI 상태만** 담당한다. 모달 열림 여부, 선택된 탭,
  필터 UI 상태 같은 것.
- API 응답을 Zustand 에 복사해 넣지 않는다. 두 곳에 같은 데이터가 있으면
  동기화 버그가 생긴다.
- QueryClient 는 `src/lib/query-client.ts` 의 `getQueryClient()` 를 쓴다.
  `new QueryClient()` 를 직접 호출하지 않는다. 서버에서 요청마다 새로 만들지
  않으면 사용자 간 캐시가 섞인다.

## 컴포넌트

- variant 는 `class-variance-authority`(CVA) 로 선언하고 `cn()`(`@/lib/utils`)
  으로 className 을 합친다.
- 서버 컴포넌트가 기본이다. `"use client"` 는 훅, 이벤트 핸들러, 브라우저 API 가
  필요할 때만 붙이고 가능한 한 트리 아래쪽에 둔다.

## 작업 후 확인

- 코드를 고쳤으면 `npm run build` 와 `npm run lint` 를 돌린다.
- 토큰을 고쳤으면 `/design-system` 에서 눈으로 확인한다.
