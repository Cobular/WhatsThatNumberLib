import {
  FractionTable,
  generateSternBorcotTreeToDepth,
  LookupManager,
  ProcessNumberResults,
  ProcessNumberResultsItem,
  round,
  sigfigs,
} from "./Utils"
import math = require("mathjs")
import * as fs from "fs";

class IrrationalManager extends LookupManager {
  public static readonly irrationals: [string, number, number][] = [
    ["pi", 3.141592653589793115997963468544185161590576171875, 1],
    ["pi²", 9.869604401089357992304940125904977321624755859375, 9],
    ["φ", 1.6180339887498949025257388711906969547271728515625, 9],
    ["e", 2.71828182845904509079559829842764884233474731445312, 1],
    ["e²", 7.38905609893064951876340273884125053882598876953125, 1],
    ["√2", 1.41421356237309514547462185873882845044136047363281, 1],
    ["√3", 1.73205080756887719317660412343684583902359008789062, 1],
    ["√3/√2", 1.22474487139158894066781613219063729047775268554688, 1],
    ["√5", 2.236067977499789805051477742381393909454345703125, 2],
    ["√7", 2.64575131106459071617109657381661236286163330078125, 3],
  ]
  table: FractionTable
  rationalTable: FractionTable

  constructor() {
    super()
    this.table = {}
    this.rationalTable = {}
    this.fillTable(IrrationalManager.irrationals)
  }

  // For now this is just going to iterate over the returned fractions. Later though, we'll be able to be smarter about
  // this by prioritizing certain fractions by their relative likelihood of occurring
  find_best_fraction(input: number): ProcessNumberResultsItem | undefined {
    const round_target = sigfigs(input)

    const possible_fractions = this.find_many_fractions(input, round_target)
    const selected_fraction = IrrationalManager.getFirstResult(
      possible_fractions
    )

    // If round target is less than like 3, prioritize simpler fractions (fractions with 1 on numerator or denominator)
    if (round_target < 3) {
    }

    if (IrrationalManager.validateAnswer(selected_fraction, round_target)) {
      return selected_fraction
    }
    return undefined
  }

  find_many_fractions(
    input: number,
    round_target: number
  ): ProcessNumberResults {
    let diff_of_squares: ProcessNumberResultsItem[] = []
    let flag = false
    // Calculate without rounding and use that if it returns exactly zero. This fixes issues with small rationals getting confused.

    for (let possible_value in this.rationalTable) {
      if (this.rationalTable.hasOwnProperty(possible_value)) {
        const test_result = (input - +possible_value) ** 2
        if (test_result === 0) {
          diff_of_squares.push([
            this.rationalTable[possible_value],
            test_result,
          ])
          flag = true
          break
        }
      }
    }

    if (!flag)
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
    test.forEach((value) => {
      const input = round(value[1], 10)
      const result = this.find_many_fractions(input, sigfigs(input))
      if (value[0] === result[0][0]) {
        counter += result[0][1]
      } else {
        console.error(
          `Test FAILED for ${value[0]}: ${value[1]}. Best Certainty:  ${result[0][1]}`
        )
      }
    })
    console.log(counter / 50)
  }

  private fillTable(
    irrationals: [string, number, number][],
    depth: number = 5
  ) {
    // Fill with rationals
    this.simpleRational(20)
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
    for (const fraction of fractions) {
      if (fraction.numerator > 20 || fraction.denominator > 20)
        continue
      const result = fraction.numerator / fraction.denominator
      this.table[result] = `${fraction.numerator}/${fraction.denominator}`
      this.rationalTable[
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
      ] = `(${irrational_string}*${fraction.numerator})/${fraction.denominator}`
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
      ] = `${fraction.numerator}/(${fraction.denominator}*${irrational_string})`
    }
  }
}

export { IrrationalManager }
