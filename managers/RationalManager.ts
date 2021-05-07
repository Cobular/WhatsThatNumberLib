import {
  FractionTable,
  generateSternBorcotTreeToDepth, LookupManager,
  ProcessNumberResults,
  ProcessNumberResultsItem,
  round, sigfigs,
} from "./Utils"

export class RationalManager extends LookupManager{
  table: FractionTable
  readonly irrationals: [string, number, number][] = [
    ["", 1, 1],
    ["pi", 3.141592653589793115997963468544185161590576171875, 1],
    ["pi²", 9.869604401089357992304940125904977321624755859375, 9],
    ["e", 2.71828182845904509079559829842764884233474731445312, 1],
    ["e²", 7.38905609893064951876340273884125053882598876953125, 1],
    ["√2", 1.41421356237309514547462185873882845044136047363281, 1],
    ["√3", 1.73205080756887719317660412343684583902359008789062, 1],
    ["√5", 2.236067977499789805051477742381393909454345703125, 2],
    ["√7", 2.64575131106459071617109657381661236286163330078125, 3],
  ]

  constructor() {
    super();
    this.table = {}
    this.fillTable()
  }

  find_many_fractions(input: number, round_target: number): ProcessNumberResults {
    let diff_of_squares: ProcessNumberResultsItem[] = []

    this.irrationals.forEach((irrational) => {
      diff_of_squares = [
        ...diff_of_squares,
        ...this.multiplyAndSearch(
          input,
          irrational[1],
          irrational[0],
          round_target
        ),
        ...this.divAndSearch(input, irrational[1], irrational[0], round_target),
      ]
    })

    diff_of_squares.sort(function (a, b) {
      return a[1] - b[1]
    })
    // This will always have more than 5 items
    // @ts-ignore
    return diff_of_squares.slice(0, 5)
  }

  private search(
    query: number,
    irrational_string: string,
    irrational_string_left: boolean,
    round_target: number
  ): ProcessNumberResultsItem[] {
    let diff_of_squares: ProcessNumberResultsItem[] = []

    for (let possible_value in this.table) {
      if (this.table.hasOwnProperty(possible_value)) {
        diff_of_squares.push([
          irrational_string_left
            ? `${this.table[possible_value]}*${irrational_string}`
            : `${irrational_string}*${this.table[possible_value]}`,
          (query - round(+possible_value, round_target)) ** 2,
        ])
      }
    }

    return diff_of_squares
  }

  private multiplyAndSearch(
    query: number,
    irrational: number,
    irrational_string: string,
    round_target: number
  ) {
    const mult = query * irrational

    return this.search(mult, irrational_string, true, round_target)
  }

  private divAndSearch(
    query: number,
    irrational: number,
    irrational_string: string,
    round_target: number
  ) {
    const div = query / irrational

    return this.search(div, irrational_string, false, round_target)
  }

  private fillTable() {
    // Fill with rationals
    this.simpleRational(7)
  }

  private simpleRational(depth: number) {
    const fractions = generateSternBorcotTreeToDepth(depth)
    console.debug(`Generating ${fractions.length} for rationals`)
    for (const fraction of fractions) {
      const result = fraction.numerator / fraction.denominator
      this.table[
        result
      ] = `${fraction.numerator}/${fraction.denominator}`
    }
  }
}
