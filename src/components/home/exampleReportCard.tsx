import { ExampleReportCarousel } from "@/components/home/exampleReportCarousel";

/**
 * 홈의 "예시로 보는 판정 리포트". 로그인·입력 없이 결과 화면이 어떤 모습인지 보여준다.
 * 카드 본문은 디자이너가 내보낸 예시 이미지(case1, case2)를 자동 순환으로 보여준다.
 */
export function ExampleReportCard() {
  return (
    <section className="flex flex-col gap-[14px]">
      <h2 className="text-body-2 font-bold text-foreground">
        판정 리포트를 받아 보세요!
      </h2>

      <ExampleReportCarousel />

      <p className="text-center text-caption-2 font-medium text-neutral-400">
        공개 자료 기준으로 계산한 예시에요.
      </p>
    </section>
  );
}
