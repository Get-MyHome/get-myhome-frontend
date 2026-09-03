/** 서비스명. 스플래시 로고와 오픈그래프·문서 제목에 같은 값을 쓴다 */
export const SERVICE_NAME = "Homm, 살 수 있어?";

/** 서비스 한 줄 소개. 줄바꿈은 디자인의 3행 배치를 그대로 따른다 */
export const SERVICE_TAGLINE_MULTILINE =
  "소득·자산만 입력하면 계약금부터 잔금까지,\n해당 청약을 감당할 수 있는지\n단계별로 확인해 드려요.";

/** meta description 처럼 한 줄로 써야 하는 곳 */
export const SERVICE_TAGLINE = SERVICE_TAGLINE_MULTILINE.replace(/\n/g, " ");
