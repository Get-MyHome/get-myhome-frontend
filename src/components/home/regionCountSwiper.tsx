"use client";

import { useRef, useState } from "react";

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
 * 지역별 제공 중인 청약 개수. 3개씩 페이지로 스와이프(scroll-snap) + 하단 도트.
 * 지역별 집계 API 가 없어 지역마다 개별 조회한다 — 집계 엔드포인트가 생기면 교체.
 */
export function RegionCountSwiper() {
  const { counts, updatedAt } = useRegionCountsQuery();
  const [pageIndex, setPageIndex] = useState(0);

  const pages = chunk(counts, PER_PAGE);

  // 트랙패드/터치 스크롤은 브라우저가 기본 지원하지만, 마우스 클릭 드래그는
  // overflow-x-auto 만으로 동작하지 않아 직접 scrollLeft 를 옮겨준다
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startScrollLeft: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = {
      startX: event.pageX,
      startScrollLeft: track.scrollLeft,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !dragState.current) return;
    event.preventDefault();
    track.scrollLeft =
      dragState.current.startScrollLeft -
      (event.pageX - dragState.current.startX);
  };

  const endDrag = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  return (
    <section className="flex flex-col gap-[14px]">
      <div className="flex items-center justify-between">
        <h2 className="text-body-2 font-bold text-foreground">
          지역별 제공 중인 청약공고 개수
        </h2>
        {updatedAt && (
          <p className="text-body-3 font-medium text-neutral-300">
            {formatDotDate(updatedAt.split(" ")[0])} 업데이트
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-[20px]">
        <div
          ref={trackRef}
          onScroll={(event) => {
            const el = event.currentTarget;
            setPageIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          className={cn(
            "flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            isDragging
              ? "cursor-grabbing select-none"
              : "cursor-grab snap-x snap-mandatory"
          )}
        >
          {pages.map((page, i) => (
            <div key={i} className="flex w-full shrink-0 snap-start gap-[11px]">
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
      {item.isLoading ? (
        // 값이 없는 것(0개)과 아직 못 받은 것을 구분해준다. 높이를 caption-2 줄높이
        // (16px)에 맞춰 숫자가 들어와도 칩이 흔들리지 않는다
        <span
          role="status"
          aria-label={`${item.region} 청약 건수 불러오는 중`}
          className="h-[16px] w-[26px] animate-pulse rounded-[3px] bg-border"
        />
      ) : (
        <span className="text-caption-2 font-bold text-neutral-500">
          {item.count === null ? "—" : `${item.count}개`}
        </span>
      )}
    </div>
  );
}
