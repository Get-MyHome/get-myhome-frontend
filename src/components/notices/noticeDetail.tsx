"use client";

import { useRouter } from "next/navigation";

import BuildingIcon from "@/assets/icons/building.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import LocationPointIcon from "@/assets/icons/locationPoint.svg";
import { UnitTypeSelector } from "@/components/notices/unitTypeSelector";
import { ErrorState } from "@/components/ui/errorState";
import { E012_NOTICE_LOAD_FAILED, NOTICE_NOT_FOUND } from "@/constants/errors";
import { getHttpStatus } from "@/lib/httpClient";
import { useComplexDetailQuery } from "@/queries/complexes";
import { formatDotDate } from "@/utils/format";

export function NoticeDetail({ complexId }: { complexId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } =
    useComplexDetailQuery(complexId);

  const wrapper =
    "flex flex-1 flex-col gap-[30px] px-gutter pt-5 pb-[calc(env(safe-area-inset-bottom)+12px)]";

  if (isLoading) {
    return (
      <div className={wrapper}>
        <p className="py-[24px] text-body-2 font-medium text-muted-foreground">
          불러오는 중이에요
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={wrapper}>
        {getHttpStatus(error) === 404 ? (
          <ErrorState
            message={NOTICE_NOT_FOUND}
            actionLabel="목록으로"
            onAction={() => router.back()}
          />
        ) : (
          <ErrorState
            message={E012_NOTICE_LOAD_FAILED}
            actionLabel="새로고침"
            onAction={() => refetch()}
          />
        )}
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <div className="flex flex-col gap-[8px] rounded-[6px] bg-primary-50 p-[12px]">
        <span className="flex w-fit items-center rounded-[5px] bg-primary-400 p-[4px]">
          <BuildingIcon aria-hidden="true" className="size-6 text-foreground" />
        </span>
        <h2 className="text-subtitle-3 font-bold text-foreground">{data.name}</h2>
        <p className="flex items-center gap-[4px] text-body-3 font-medium text-foreground">
          <LocationPointIcon aria-hidden="true" className="size-[17px] shrink-0" />
          {data.address}
        </p>
        <p className="flex items-center gap-[4px] text-body-3 font-medium text-foreground">
          <CalendarIcon aria-hidden="true" className="size-[17px] shrink-0" />
          청약 마감 {formatDotDate(data.application_end_date)}
        </p>
      </div>

      <UnitTypeSelector
        complexId={complexId}
        unitTypes={data.unit_types}
        sourceUrl={data.source_url}
      />
    </div>
  );
}
