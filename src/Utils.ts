export interface Fraction {
  numerator: number
  denominator: number
}

export function round(input: number, size: number): number {
  return +input.toPrecision(size)
}

export interface FractionTable {
  [key: number]: string
}

export type ProcessNumberResultsItem = [string, number]
export type ProcessNumberResults = [
  ProcessNumberResultsItem,
  ProcessNumberResultsItem,
  ProcessNumberResultsItem,
  ProcessNumberResultsItem,
  ProcessNumberResultsItem
]

export function sigfigs(value: number) {
  if (value === 0) {
    return 0
  }
  //create absolute value and
  const t1 = "" + Math.abs(value)
  //remove decimal point
  const t2 = t1.replace(".", "")

  //if number is represented by scientific notation,
  //the places before "e" (minus "-" and ".") are the
  //significant digits. So here we can just return the index
  //"-234.3e+50" -> "2343e+50" -> indexOf("e") === 4
  const i = t2.indexOf("e")
  if (i > -1) {
    return i
  }

  //if the original number had a decimal point,
  //trailing zeros are already removed, since irrelevant
  //0.001230000.toString() -> "0.00123" -> "000123"
  if (t2.length < t1.length) {
    // -> remove only leading zeros
    return t2.replace(/^0+/, "").length
  }

  //if number did not contain decimal point,
  //leading zeros are already removed
  //000123000.toString() -> "123000"
  // -> remove only trailing zeros
  return t2.replace(/0+$/, "").length
}

export abstract class LookupManager {
  public table: FractionTable

  protected constructor() {
    this.table = {}
  }

  static validateAnswer(
    answer_candidate: ProcessNumberResultsItem,
    input_decimals: number
  ): boolean {
    let threshold: number
    let underflow: boolean = false

    // Compensate for the below numbers being averages for a large number of trials
    const correction_factor = 4

    switch (input_decimals) {
      case 0:
        threshold = 4
        break
      case 1:
        threshold = 5
        break
      case 2:
        threshold = 7
        break
      case 3:
        threshold = 8
        break
      case 4:
        threshold = 10
        break
      case 5:
        threshold = 12
        break
      case 6:
        threshold = 14
        break
      case 7:
        threshold = 16
        break
      case 8:
        threshold = 18
        break
      case 9:
        threshold = 20
        break
      case 10:
        threshold = 22
        break
      case 11:
        threshold = 24
        break
      case 12:
        threshold = 26
        break
      case 13:
        threshold = 28
        break
      case 14:
        threshold = 30
        break
      case 15:
        threshold = 32
        break
      case 16:
        threshold = 34
        break
      case 17:
        threshold = 37
        break
      // Larger thresholds seem to usually underflow, so we'll set that and flip the threshold
      default:
        underflow = true
        threshold = 0
        break
    }

    // If answer_candidate[1] > 1, fail instantly. Nothing should have that bad of an accuracy
    // If -Math.log10(answer_candidate[1]) - threshold < correction_factor, pass, the answer candidate is well within the range
    // If -Math.log10(answer_candidate[1]) - threshold > correction_factor, fail
    const best_answer_difference = answer_candidate[1]

    if (best_answer_difference === 0) {
      return true
    }
    if (best_answer_difference > 1) {
      return false
    }
    return Math.log10(answer_candidate[1]) + threshold < correction_factor
  }

  static getFirstResult(
    results: ProcessNumberResults
  ): ProcessNumberResultsItem {
    return results[0]
  }

  abstract find_many_fractions(
    input: number,
    round_target: number
  ): ProcessNumberResults
}
