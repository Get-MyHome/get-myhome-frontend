import CheckIcon from "@/assets/icons/check.svg";

type Swatch = { name: string; hex: string; className: string; note?: string };

const NEUTRAL: Swatch[] = [
  { name: "neutral-50", hex: "#FFFFFF", className: "bg-neutral-50" },
  { name: "neutral-100", hex: "#F8F9FC", className: "bg-neutral-100" },
  { name: "neutral-200", hex: "#F2F4FC", className: "bg-neutral-200" },
  { name: "neutral-300", hex: "#828294", className: "bg-neutral-300" },
  { name: "neutral-400", hex: "#5C5C6F", className: "bg-neutral-400" },
  { name: "neutral-500", hex: "#303044", className: "bg-neutral-500" },
  { name: "neutral-600", hex: "#111125", className: "bg-neutral-600" },
];

const PRIMARY: Swatch[] = [
  { name: "primary-50", hex: "#F9F5FF", className: "bg-primary-50" },
  { name: "primary-100", hex: "#F3ECFF", className: "bg-primary-100" },
  { name: "primary-200", hex: "#ECE2FE", className: "bg-primary-200" },
  { name: "primary-300", hex: "#E6D9FE", className: "bg-primary-300" },
  { name: "primary-400", hex: "#DAC6FE", className: "bg-primary-400" },
  { name: "primary-500", hex: "#C084FC", className: "bg-primary-500" },
  { name: "primary-600", hex: "#581C87", className: "bg-primary-600", note: "CTA" },
];

const YELLOW: Swatch[] = [
  { name: "yellow-1", hex: "#514400", className: "bg-yellow-1" },
  { name: "yellow-2", hex: "#FEDC2A", className: "bg-yellow-2" },
  { name: "yellow-3", hex: "#FEF0A3", className: "bg-yellow-3" },
  { name: "yellow-4", hex: "#FFFBE5", className: "bg-yellow-4" },
];

const GREEN: Swatch[] = [
  { name: "green-1", hex: "#08875D", className: "bg-green-1" },
  { name: "green-2", hex: "#11D996", className: "bg-green-2" },
  { name: "green-3", hex: "#ECFDF8", className: "bg-green-3" },
];

const RED: Swatch[] = [
  { name: "red-1", hex: "#E02D3C", className: "bg-red-1" },
  { name: "red-2", hex: "#FFC4C9", className: "bg-red-2" },
  { name: "red-3", hex: "#FEF1F2", className: "bg-red-3" },
];

const BLUE: Swatch[] = [
  { name: "blue-1", hex: "#1D2433", className: "bg-blue-1" },
  { name: "blue-2", hex: "#1976D2", className: "bg-blue-2" },
  { name: "blue-3", hex: "#E5F1FA", className: "bg-blue-3" },
  { name: "blue-4", hex: "#FAFAFA", className: "bg-blue-4" },
];

const MONO: Swatch[] = [
  { name: "black", hex: "#000000", className: "bg-black" },
  { name: "white", hex: "#FFFFFF", className: "bg-white" },
];

const SEMANTIC: Swatch[] = [
  { name: "primary", hex: "primary-600", className: "bg-primary" },
  { name: "primary-subtle", hex: "primary-100", className: "bg-primary-subtle" },
  { name: "success", hex: "green-1", className: "bg-success" },
  { name: "success-subtle", hex: "green-3", className: "bg-success-subtle" },
  { name: "warning", hex: "yellow-2", className: "bg-warning" },
  { name: "warning-subtle", hex: "yellow-4", className: "bg-warning-subtle" },
  { name: "danger", hex: "red-1", className: "bg-danger" },
  { name: "danger-subtle", hex: "red-3", className: "bg-danger-subtle" },
  { name: "info", hex: "blue-2", className: "bg-info" },
  { name: "info-subtle", hex: "blue-3", className: "bg-info-subtle" },
  { name: "muted", hex: "neutral-200", className: "bg-muted" },
  { name: "border", hex: "neutral-200", className: "bg-border" },
];

const TYPE = [
  { name: "heading-1", className: "text-heading-1", spec: "30 / 40" },
  { name: "heading-2", className: "text-heading-2", spec: "28 / 38" },
  { name: "heading-3", className: "text-heading-3", spec: "24 / 32" },
  { name: "subtitle-1", className: "text-subtitle-1", spec: "20 / 28" },
  { name: "subtitle-2", className: "text-subtitle-2", spec: "18 / 26" },
  { name: "subtitle-3", className: "text-subtitle-3", spec: "16 / 24" },
  { name: "subtitle-4", className: "text-subtitle-4", spec: "14 / 20" },
  { name: "subtitle-5", className: "text-subtitle-5", spec: "12 / 16" },
  { name: "body-1", className: "text-body-1", spec: "16 / 24" },
  { name: "body-2", className: "text-body-2", spec: "14 / 20" },
  { name: "body-3", className: "text-body-3", spec: "12 / 16" },
  { name: "caption-1", className: "text-caption-1", spec: "14 / 20" },
  { name: "caption-2", className: "text-caption-2", spec: "12 / 16" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-border pb-2 text-heading-3 font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((s) => (
        <div key={s.name} className="w-32">
          <div
            className={`h-20 rounded-md border border-border ${s.className}`}
          />
          <p className="mt-1.5 text-caption-2 font-medium">{s.name}</p>
          <p className="text-caption-2 text-muted-foreground">{s.hex}</p>
          {s.note ? (
            <p className="text-caption-2 text-danger">{s.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-12 px-6 py-12">
      <header className="space-y-1">
        <h1 className="text-heading-1 font-bold">Design System</h1>
        <p className="text-body-2 text-muted-foreground">
          디자인 파일의 토큰이 코드에 어떻게 들어와 있는지 확인하는 페이지입니다.
        </p>
      </header>

      <Section title="Neutral Gray">
        <Swatches items={NEUTRAL} />
      </Section>

      <Section title="Primary">
        <Swatches items={PRIMARY} />
      </Section>

      <Section title="Yellow">
        <Swatches items={YELLOW} />
      </Section>

      <Section title="Green">
        <Swatches items={GREEN} />
      </Section>

      <Section title="Red">
        <Swatches items={RED} />
      </Section>

      <Section title="Blue">
        <Swatches items={BLUE} />
      </Section>

      <Section title="Black & White">
        <Swatches items={MONO} />
      </Section>

      <Section title="Semantic">
        <p className="text-body-2 text-muted-foreground">
          컴포넌트는 팔레트가 아니라 이 이름을 쓴다. 매핑은 globals.css 3번 블록.
        </p>
        <Swatches items={SEMANTIC} />
      </Section>

      <Section title="Typography">
        <p className="text-body-2 text-muted-foreground">
          Pretendard · letter-spacing 0 · weight 는 font-light / font-medium /
          font-bold 로 따로 지정
        </p>
        <div className="divide-y divide-border">
          {TYPE.map((t) => (
            <div
              key={t.name}
              className="flex items-baseline justify-between gap-6 py-3"
            >
              <span className={`${t.className} font-medium`}>
                겟마이홈, 주택청약
              </span>
              <span className="shrink-0 text-caption-2 text-muted-foreground">
                {t.name} · {t.spec}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icon">
        <p className="text-body-2 text-muted-foreground">
          src/assets/icons 의 SVG 를 import 하면 컴포넌트가 된다. 크기는
          size-*, 색은 text-* 로 제어한다.
        </p>
        <div className="flex items-center gap-6">
          <CheckIcon className="size-4 text-foreground" />
          <CheckIcon className="size-5 text-primary" />
          <CheckIcon className="size-6 text-success" />
          <CheckIcon className="size-8 text-danger" />
        </div>
      </Section>
    </main>
  );
}
