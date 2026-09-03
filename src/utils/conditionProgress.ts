import {
  needsMarriagePlannedDate,
  type EligibilityConditions,
} from "@/types/eligibility";

export interface ConditionProgress {
  /** 답변해야 하는 질문 수 (미혼·기혼 6 · 결혼예정 7) */
  total: number;
  /** 답변을 마친 질문 수 */
  answered: number;
  /** 0~100 정수 */
  percent: number;
}

const filled = (value: string) => value.trim() !== "";
const chosen = (value: boolean | null) => value !== null;

/** 게이트 질문 하나의 상태 */
interface GateState {
  /** "예" 로 답해서 하위 입력칸이 열린 상태인지 */
  open: boolean;
  /** 하위 값까지 포함해 이 질문이 완료됐는지 */
  complete: boolean;
}

/**
 * 하위 입력칸을 가진 게이트 질문 3개.
 * "아니오" 면 하위 입력이 없으므로 그것만으로 완료, "예" 면 하위 값까지 채워야 완료다.
 */
function gates(c: EligibilityConditions): Record<string, GateState> {
  return {
    existingLoan: {
      open: c.hasExistingLoan === true,
      complete:
        c.hasExistingLoan === false ||
        (c.hasExistingLoan === true &&
          filled(c.existingLoanMonthlyPayment) &&
          filled(c.existingLoanBalance)),
    },
    policyLoan: {
      open: c.checkPolicyLoan === true,
      complete:
        c.checkPolicyLoan === false ||
        (c.checkPolicyLoan === true &&
          c.householdRole !== null &&
          chosen(c.allMembersHomeless) &&
          filled(c.netWorth) &&
          chosen(c.firstTimeBuyer)),
    },
    subscriptionAccount: {
      open: c.hasSubscriptionAccount === true,
      complete:
        c.hasSubscriptionAccount === false ||
        (c.hasSubscriptionAccount === true &&
          c.subscriptionAccountOpenedDate.length === 8 &&
          filled(c.subscriptionAccountDepositCount)),
    },
  };
}

/**
 * 추가 조건 입력 진행률.
 *
 * 이 화면에 뜨는 질문 하나를 1개로 센다. 게이트 질문의 하위 입력칸(월 상환액·
 * 개설일·세대구성·순자산 등)은 분모에 따로 세지 않되, 게이트에 "예" 로 답했으면
 * 하위 값까지 채워야 그 질문을 완료로 본다.
 *
 * 100% 는 "이 화면에 더 답할 것이 없다" 를 뜻해야 하므로, 하위 입력칸이 없는
 * 단독 질문(소득 형태·청약 당첨권·월 저축 가능액)도 분모에 포함한다.
 *
 * 분모는 미혼·기혼 6개, 결혼예정은 결혼 예정일이 더해져 7개다. 배우자 연소득은
 * 1단계 필수라 이 화면에 오기 전에 채워져 있어 질문으로 세지 않는다.
 * 어느 유형이든 0% 에서 시작해 100% 에 도달할 수 있다.
 */
export function getConditionProgress(
  c: EligibilityConditions,
): ConditionProgress {
  const gate = gates(c);

  // 화면에 놓인 순서대로 — "N개 중 M개" 가 스크롤 순서와 어긋나지 않게
  const questions: boolean[] = [c.incomeType !== null];

  if (needsMarriagePlannedDate(c.maritalStatus)) {
    questions.push(c.marriagePlannedMonth.length === 6);
  }

  questions.push(
    gate.existingLoan.complete,
    chosen(c.hasSubscriptionRight),
    gate.policyLoan.complete,
    gate.subscriptionAccount.complete,
    filled(c.monthlySaving),
  );

  const total = questions.length;
  const answered = questions.filter(Boolean).length;

  return {
    total,
    answered,
    percent: total === 0 ? 100 : Math.round((answered / total) * 100),
  };
}

/**
 * "예" 로 답해 열린 하위 입력칸이 비어 있는 게이트가 있는지.
 * 이 상태로는 추가 조건 입력을 제출하지 못하게 막는다 — 열어놓고 비워둔 값은
 * 판정에 전달되지 않아, 화면에 보이는데 무시되는 칸이 생기기 때문이다.
 */
export function hasIncompleteGate(c: EligibilityConditions): boolean {
  return Object.values(gates(c)).some((gate) => gate.open && !gate.complete);
}
