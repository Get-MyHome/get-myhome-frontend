import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@/styles/globals.css";

import { Splash } from "@/components/layout/splash";
import { SERVICE_TAGLINE } from "@/constants/service";
import { SPLASH_SEEN_STORAGE_KEY } from "@/constants/storage";

import { Providers } from "./providers";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 배포 도메인. og:image 는 절대 URL 이어야 해서 여기서 기준을 잡는다.
  // 배포 시 NEXT_PUBLIC_SITE_URL 을 반드시 설정할 것 — 없으면 localhost 가 박힌다
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Get-MyHome",
  description: SERVICE_TAGLINE,
  // 파일 규약(app/icon.png · app/opengraph-image.png) 대신 public/ 을 직접 가리킨다.
  // 규약을 쓰지 않으므로 크기·트위터 태그를 여기서 손으로 채워야 한다.
  icons: { icon: "/icon.png" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Get-MyHome",
    title: "Get-MyHome",
    description: SERVICE_TAGLINE,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get-MyHome",
    description: SERVICE_TAGLINE,
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistMono.variable} antialiased`}>
      <body className="bg-white">
        {/* 스플래시는 세션당 첫 진입에만 띄운다. 판정을 리액트에 맡기면 서버가
            그린 HTML 이 하이드레이션 전에 이미 떠서 새로고침 때 깜빡인다.
            그래서 스플래시 마크업보다 먼저 실행되는 이 스크립트가 판정한다.
            노출 도중 새로고침해도 다시 뜨지 않도록 기록은 즉시 남긴다. */}
        <style>{`html[data-splash-seen] #splash{display:none!important}`}</style>
        <script
          dangerouslySetInnerHTML={{
            __html:
              `try{var k=${JSON.stringify(SPLASH_SEEN_STORAGE_KEY)};` +
              `if(sessionStorage.getItem(k)){` +
              `document.documentElement.setAttribute('data-splash-seen','')}` +
              `else{sessionStorage.setItem(k,'1')}}catch(e){}`,
          }}
        />
        <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background">
          <Providers>{children}</Providers>
        </div>
        <Splash />
      </body>
    </html>
  );
}
