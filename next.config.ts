import type { NextConfig } from "next";

// 백엔드가 평문 HTTP 라 HTTPS 배포에서 브라우저가 직접 호출을 막는다(Mixed Content).
// /api/proxy/* 를 서버에서 백엔드로 넘겨 우회한다. 백엔드에 HTTPS 가 붙으면 제거 가능.
// 값은 .env.local(로컬) / 배포 환경변수 에서만 온다. 누락 시 빌드를 멈춘다.
const BACKEND_ORIGIN = process.env.BACKEND_API_ORIGIN;
if (!BACKEND_ORIGIN) {
  throw new Error(
    "환경변수 BACKEND_API_ORIGIN 이 필요합니다 (예: http://13.209.148.94:8080). " +
      ".env.local 또는 배포 환경변수에 설정하세요."
  );
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      // .svg 를 import 하면 React 컴포넌트로 변환된다.
      // dimensions: false 로 width/height 를 떼서 크기는 className 으로 제어한다.
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              dimensions: false,
              // Figma 에서 색이 하드코딩된 채로 나와도 currentColor 로 바꿔
              // text-* 유틸리티로 색을 제어할 수 있게 한다.
              replaceAttrValues: {
                "#000": "currentColor",
                "#000000": "currentColor",
                "#1D2433": "currentColor",
                "#111125": "currentColor",
                // 하단 네비의 비활성 아이콘이 neutral-300 으로 고정 export 된다.
                // 활성/비활성 색을 코드에서 바꾸려면 currentColor 여야 한다.
                "#828294": "currentColor",
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
