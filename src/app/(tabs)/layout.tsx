import { TabBar } from "@/components/layout/tabBar";

/**
 * 하단 탭을 공유하는 화면들의 셸.
 * 본문 아래 여백은 고정된 탭(56px)과 safe-area, 디자인상 간격 8px 을 더한 값이다.
 */
export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 pb-[calc(56px+env(safe-area-inset-bottom)+8px)]">
        {children}
      </main>
      <TabBar />
    </>
  );
}
