import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
