import {
  FractionTable,
  generateSternBorcotTreeToDepth,
  LookupManager,
  ProcessNumberResults,
  ProcessNumberResultsItem,
  round,
} from "./Utils"

class IrrationalManager extends LookupManager {
  table: FractionTable
  readonly irrationals: [string, number, number][] = [
    ["pi", 3.14159265358979311599796346854418516159057617187500, 1],
    ["pi²", 9.86960440108935799230494012590497732162475585937500, 9],
    ["e", 2.71828182845904509079559829842764884233474731445312, 1],
    ["e²", 7.38905609893064951876340273884125053882598876953125, 1],
    ["√2", 1.41421356237309514547462185873882845044136047363281, 1],
    ["√3", 1.73205080756887719317660412343684583902359008789062, 1],
    ["√5", 2.23606797749978980505147774238139390945434570312500, 2],
    ["√7", 2.64575131106459071617109657381661236286163330078125, 3],
  ]

  constructor() {
    super();
    this.table = {}
    this.fillTable(this.irrationals)
  }

  private fillTable(irrationals: [string, number, number][], depth: number = 4) {
    // Fill with rationals
    this.simpleRational(5)
    // Do all the irrationals
    irrationals.forEach((value) => {
      this.simpleIrrational(value[1], value[0], depth)
    })
  }

  private simpleIrrational(
    irrational: number,
    irrational_string: string,
    depth: number
  ) {
    this.simpleIrrationalNumerator(irrational, irrational_string, depth)
    this.simpleIrrationalDenominator(irrational, irrational_string, depth)
  }

  private simpleRational(depth: number) {
    const fractions = generateSternBorcotTreeToDepth(depth)
    // console.debug(`Generating ${fractions.length} for rationals`)
    for (const fraction of fractions) {
      const result = fraction.numerator / fraction.denominator
      this.table[
        result
      ] = `${fraction.numerator}/${fraction.denominator}`
    }
  }

  private simpleIrrationalNumerator(
    irrational: number,
    irrational_string: string,
    depth: number
  ) {
    const fractions = generateSternBorcotTreeToDepth(depth)
    // console.debug(`Generating ${fractions.length} for ${irrational_string}`)
    for (const fraction of fractions) {
      const result = (irrational * fraction.numerator) / fraction.denominator
      this.table[
        result
      ] = `${irrational_string}*${fraction.numerator}/${fraction.denominator}`
    }
  }

  private simpleIrrationalDenominator(
    irrational: number,
    irrational_string: string,
    depth: number
  ) {
    const fractions = generateSternBorcotTreeToDepth(depth)
    // console.debug(`Generating ${fractions.length} for 1/${irrational_string}`)
    for (const fraction of fractions) {
      const result = fraction.numerator / (fraction.denominator * irrational)
      this.table[
        result
      ] = `${fraction.numerator}/${fraction.denominator}*${irrational_string}`
    }
  }

  lookup(input: number): ProcessNumberResults {
    const round_target = input.toString().length - 1

    let diff_of_squares: ProcessNumberResultsItem[] = []
    for (let possible_value in this.table) {
      if (this.table.hasOwnProperty(possible_value))
        diff_of_squares.push([
          this.table[possible_value],
          (input - round(+possible_value, round_target)) ** 2,
        ])
    }
    diff_of_squares.sort(function (a, b) {
      return a[1] - b[1]
    })
    // This will always have more than 5 items
    // @ts-ignore
    return diff_of_squares.slice(0, 5)
  }

  selfTest() {
    const test: [string, number][] = []
    const numbers = Object.keys(this.table)
    for (let i = 0; i < 50; i++) {
      const key = numbers[Math.floor(Math.random() * numbers.length)]
      // @ts-ignore
      test.push([this.table[key], +key])
    }
    let counter = 0
    test.forEach(value => {
      const result = this.lookup(round(value[1], 10))
      if (value[0] === result[0][0]) {
        counter += result[0][1]
        // console.log(`Test Passed for ${value[0]}: ${value[1]}. Certainty: ${result[0][1]}`)
      } else {
        console.error(`Test FAILED for ${value[0]}: ${value[1]}. Best Certainty:  ${result[0][1]}`)
      }
    })
    console.log(counter/50)
  }
}

export { IrrationalManager }
