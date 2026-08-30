"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC, SVGProps } from "react";

import TabHomeIcon from "@/assets/icons/tabHome.svg";
import TabNoticeIcon from "@/assets/icons/tabNotice.svg";
import { cn } from "@/utils/cn";

interface TabItem {
  href: string;
  label: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
}

const TAB_ITEMS: TabItem[] = [
  { href: "/", label: "홈", Icon: TabHomeIcon },
  { href: "/notices", label: "공고", Icon: TabNoticeIcon },
];

/**
 * 하단 고정 네비. 화면 폭이 max-w-app 을 넘으면 본문과 같은 폭으로 가운데 정렬된다.
 * 홈 인디케이터가 있는 기기에서 겹치지 않도록 safe-area 만큼 아래 여백을 준다.
 */
export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-app -translate-x-1/2 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex">
        {TAB_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-[56px] flex-col items-center pt-[7px] text-nav font-medium",
                  isActive ? "text-foreground" : "text-neutral-300",
                )}
              >
                <Icon className="size-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
