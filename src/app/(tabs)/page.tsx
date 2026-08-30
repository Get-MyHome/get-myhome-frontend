import { EligibilityCtaCard } from "@/components/home/eligibilityCtaCard";

/** 상단 여백: 디자인의 57px 은 기기 상태바 44px 을 포함한 값이라 13px 만 남긴다. */
export default function HomePage() {
  return (
    <div className="px-gutter pt-[calc(env(safe-area-inset-top)+13px)]">
      <EligibilityCtaCard />
    </div>
  );
}
