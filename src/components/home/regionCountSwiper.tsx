"use client";

import Link from "next/link";

import LocationPointIcon from "@/assets/icons/locationPoint.svg";
import { useRegionCountsQuery } from "@/queries/complexes";

/**
 * 지역별 진행중인 청약 개수. 가로 스크롤.
 * 지역별 집계 API 가 없어 지역마다 개별 조회한다 — 나중에 집계 엔드포인트가 생기면 교체.
 */
export function RegionCountSwiper() {
  const regionCounts = useRegionCountsQuery();

  return (
    <section className="flex flex-col gap-[14px]">
      <div className="flex items-center justify-between">
        <h2 className="text-body-2 font-bold text-foreground">
          지역별 진행중인 청약
        </h2>
      </div>

      <ul className="-mx-gutter flex gap-[11px] overflow-x-auto px-gutter pb-[2px]">
        {regionCounts.map(({ region, count }) => (
          <li key={region} className="shrink-0">
            <Link
              href="/notices"
              className="flex w-[107px] flex-col items-center gap-[4px] rounded-[6px] bg-primary-50 p-[10px]"
            >
              <LocationPointIcon
                aria-hidden="true"
                className="size-[19px] text-primary"
              />
              <span className="text-caption-2 font-medium text-neutral-500">
                {region}
              </span>
              <span className="text-caption-2 font-bold text-neutral-500">
                {count === null ? "—" : `${count}개`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
