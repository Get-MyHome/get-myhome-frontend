import Image from "next/image";

import ArrowIcon from "@/assets/icons/arrow.svg";
import heroIllustration from "@/assets/images/eligibilityHero.png";

/** 소득·자산 입력으로 청약 감당 가능성을 판정하는 플로우의 진입 카드. */
export function EligibilityCtaCard() {
  return (
    <section className="flex flex-col gap-[8px] rounded-[10px] bg-primary-subtle p-[20px]">
      <Image
        src={heroIllustration}
        alt=""
        width={71}
        height={65}
        priority
        className="h-[65px] w-[71px] object-cover"
      />

      <div className="flex flex-col gap-[12px]">
        <h2 className="text-subtitle-2 font-bold text-primary">
          소득·자산만 입력하면 계약금부터 잔금까지,
          <br />
          해당 청약을 감당할 수 있는지
          <br />
          단계별로 확인해 드려요.
        </h2>

        {/* TODO: 판정 플로우 라우트가 생기면 Link 로 바꾼다 */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-[6px] rounded-[6px] bg-primary p-[10px]"
        >
          <span className="text-subtitle-4 font-bold text-primary-foreground">
            가능성 판정하기
          </span>
          {/* 에셋은 위를 향하는 화살표다. 디자인대로 90도 돌려 오른쪽을 향하게 한다 */}
          <ArrowIcon className="size-6 rotate-90" />
        </button>
      </div>
    </section>
  );
}
