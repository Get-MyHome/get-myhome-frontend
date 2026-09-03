/** 조건 입력 임시 보관 키. 판정 플로우를 새로 시작할 때 비운다 */
export const CONDITIONS_STORAGE_KEY = "eligibility-conditions";

/** 대출 자격 조회로 받은 조건 토큰 (30분 유효). 공고 매칭 호출에 재사용 */
export const FINANCING_TOKEN_STORAGE_KEY = "financing-condition-token";

/** 스플래시 노출 여부. 세션당 첫 진입에만 보여주려고 끝난 시점에 기록한다 */
export const SPLASH_SEEN_STORAGE_KEY = "splash-seen";

/** 판정 대상(단지·주택형). 평형 선택 화면에서 적고 판정결과 화면에서 읽는다 */
export const VERDICT_TARGET_STORAGE_KEY = "verdict-target";

/** 판정 실행으로 받은 verdict_id. 이메일 발송에 재사용 */
export const VERDICT_ID_STORAGE_KEY = "verdict-id";
