export interface Fraction {
  numerator: number
  denominator: number
}

export function round(input: number, size: number): number {
  return +input.toPrecision(size)
}

export type OutputModes = "default" | "object" | "latex"

export interface FractionTable {
  [key: number]: ResultFrac
}

export interface ResultFrac {
  numerator: ResultFracElement[]
  denominator: ResultFracElement[]
}

export type ResultFracElement = number | string


const irrationals = [
  ["pi", 3.141592653589793115997963468544185161590576171875, 1],
  ["pi²", 9.869604401089357992304940125904977321624755859375, 9],
  ["φ", 1.6180339887498949025257388711906969547271728515625, 9],
  ["e", 2.71828182845904509079559829842764884233474731445312, 1],
  ["e²", 7.38905609893064951876340273884125053882598876953125, 1],
  ["√2", 1.41421356237309514547462185873882845044136047363281, 1],
  ["√3", 1.73205080756887719317660412343684583902359008789062, 1],
  ["√5", 2.236067977499789805051477742381393909454345703125, 2],
  ["√7", 2.64575131106459071617109657381661236286163330078125, 3],
] as const

export const master_irrationals = ([
  ...irrationals,
  ["√3/√2", 1.22474487139158894066781613219063729047775268554688, 1],
] as unknown) as [string, number, number][]


// All the irrationals that converters need to handle
export type SimpleIrrationalsType = typeof irrationals[number][0]
export const SimpleIrrationals: SimpleIrrationalsType[] = irrationals.map(function(value,index) { return value[0]; });

export function StringIsSimpleIrrational(str: string): str is SimpleIrrationalsType {
  return SimpleIrrationals.includes(str as any);
}

export type ProcessNumberResultsItem = [string | ResultFrac, number]
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
  public rationalTableTerminating: FractionTable

  protected constructor() {
    this.rationalTableTerminating = {}
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

  abstract find_best_fraction(
    input: number
  ): ProcessNumberResultsItem | undefined
}
