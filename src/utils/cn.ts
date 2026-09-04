import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge 는 globals.css 의 타이포 스케일을 모른다. 그대로 두면
// `text-subtitle-4` 를 글자 크기가 아니라 색으로 착각해서 같은 cn() 안의
// `text-white` 와 충돌시키고 한쪽을 지워버린다. 어떤 스케일이 있는지 알려준다.
const FONT_SIZES = [
  "heading-1",
  "heading-2",
  "heading-3",
  "subtitle-1",
  "subtitle-2",
  "subtitle-3",
  "subtitle-4",
  "subtitle-5",
  "body-1",
  "body-2",
  "body-3",
  "caption-1",
  "caption-2",
  "nav",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
