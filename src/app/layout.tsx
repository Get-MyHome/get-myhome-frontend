import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

import { Splash } from "@/components/layout/splash";

import { Providers } from "./providers";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Get-MyHome",
  description: "청년의 주택 구매 자금 가능성을 판정해드려요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistMono.variable} antialiased`}>
      <body className="bg-white">
        <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background">
          <Providers>{children}</Providers>
        </div>
        <Splash />
      </body>
    </html>
  );
}
