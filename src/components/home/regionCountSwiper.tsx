"use client";

import { useState } from "react";

import LocationPointIcon from "@/assets/icons/locationPoint.svg";
import { useRegionCountsQuery, type RegionCount } from "@/queries/complexes";
import { cn } from "@/utils/cn";
import { formatDotDate } from "@/utils/format";

const PER_PAGE = 3;

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

/**
 * 지역별 진행중인 청약 개수. 3개씩 페이지로 스와이프(scroll-snap) + 하단 도트.
 * 지역별 집계 API 가 없어 지역마다 개별 조회한다 — 집계 엔드포인트가 생기면 교체.
 */
export function RegionCountSwiper() {
  const { counts, updatedAt } = useRegionCountsQuery();
  const [pageIndex, setPageIndex] = useState(0);

  const pages = chunk(counts, PER_PAGE);

  return (
    <section className="flex flex-col gap-[14px]">
      <div className="flex items-center justify-between">
        <h2 className="text-body-2 font-bold text-foreground">
          지역별 진행중인 청약
        </h2>
        {updatedAt && (
          <p className="text-body-3 font-medium text-neutral-300">
            {formatDotDate(updatedAt.split(" ")[0])} 업데이트
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-[20px]">
        <div
          onScroll={(event) => {
            const el = event.currentTarget;
            setPageIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pages.map((page, i) => (
            <div
              key={i}
              className="flex w-full shrink-0 snap-start gap-[11px]"
            >
              {page.map((item) => (
                <RegionChip key={item.region} item={item} />
              ))}
              {page.length < PER_PAGE &&
                Array.from({ length: PER_PAGE - page.length }).map((_, j) => (
                  <span key={`spacer-${j}`} className="flex-1" />
                ))}
            </div>
          ))}
        </div>

        {pages.length > 1 && (
          <div className="flex gap-[4px]">
            {pages.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-[6px] rounded-full transition-all",
                  i === pageIndex ? "w-[16px] bg-primary" : "w-[6px] bg-border"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RegionChip({ item }: { item: RegionCount }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-[4px] rounded-[6px] bg-primary-50 p-[10px]">
      <LocationPointIcon
        aria-hidden="true"
        className="size-[19px] text-primary"
      />
      <span className="text-caption-2 font-medium text-neutral-500">
        {item.region}
      </span>
      <span className="text-caption-2 font-bold text-neutral-500">
        {item.count === null ? "—" : `${item.count}개`}
      </span>
    </div>
  );
}
