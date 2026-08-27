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
