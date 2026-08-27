import Image from "next/image";

import { StartAssessmentLink } from "@/components/eligibility/startAssessmentLink";
import { SERVICE_TAGLINE_MULTILINE } from "@/constants/service";
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
        <h2 className="text-subtitle-2 font-bold whitespace-pre-line text-primary">
          {SERVICE_TAGLINE_MULTILINE}
        </h2>

        <StartAssessmentLink />
      </div>
    </section>
  );
}
