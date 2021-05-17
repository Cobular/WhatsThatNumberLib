import {
  FractionTable,
  LookupManager,
  ProcessNumberResults,
  ProcessNumberResultsItem,
  round,
  sigfigs,
  master_irrationals,
  OutputModes,
  ResultFrac,
} from "./Utils"
import {
  irrational_table,
  rational_table_non_terminating,
  rational_table_terminating,
} from "./irrationals"
import {
  generateSternBorcotTreeToDepth,
  generateTerminatingSternBorcotTreeToDepth,
} from "./SternBorcot"
import * as fs from "fs"
import { DefaultParser, LatexParser, ParserFunc } from "./OutputParsers"

class IrrationalManager extends LookupManager {
  public static irrationals = master_irrationals
  static outputModeTable: { [key in OutputModes]: ParserFunc } = {
    latex: LatexParser,
    default: DefaultParser,
    object: (frac) => frac,
  }
  table: FractionTable
  rationalTableTerminating: FractionTable
  rationalTableNonTerminating: FractionTable
  output: ParserFunc

  constructor(generate: boolean = false, output: OutputModes = "default") {
    super()
    this.table = {}
    this.rationalTableTerminating = {}
    this.rationalTableNonTerminating = {}
    this.output = IrrationalManager.outputModeTable[output]
    if (generate) this.fillTable(IrrationalManager.irrationals)
    else {
      this.table = irrational_table
      this.rationalTableTerminating = rational_table_terminating
      this.rationalTableNonTerminating = rational_table_non_terminating
    }
  }

  // For now this is just going to iterate over the returned fractions. Later though, we'll be able to be smarter about
  // this by prioritizing certain fractions by their relative likelihood of occurring
  find_best_fraction(input: number): ProcessNumberResultsItem | undefined {
    if (input === undefined || input === null) return undefined

    if (input === 0) {
      return ["0", 0]
    }

    const round_target = sigfigs(input)

    const possible_fractions = this.find_many_fractions(input, round_target)
    const selected_fraction = IrrationalManager.getFirstResult(
      possible_fractions
    )

    // If round target is less than like 3, prioritize simpler fractions (fractions with 1 on numerator or denominator)
    if (round_target < 3) {
    }

    if (IrrationalManager.validateAnswer(selected_fraction, round_target)) {
      return [
        this.output(selected_fraction[0] as ResultFrac),
        selected_fraction[1],
      ]
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

    // Only an exact match (for non-repeating numbers, can't really hit the others)
    for (let possible_value in this.rationalTableTerminating) {
      if (this.rationalTableTerminating.hasOwnProperty(possible_value)) {
        const test_result = (input - +possible_value) ** 2
        if (test_result === 0) {
          diff_of_squares.push([
            this.rationalTableTerminating[possible_value],
            test_result,
          ])
          flag = true
          break
        }
      }
    }

    if (!flag) {
      // Check non-terminating rationals
      for (let possible_value in this.rationalTableNonTerminating) {
        if (this.rationalTableNonTerminating.hasOwnProperty(possible_value))
          diff_of_squares.push([
            this.rationalTableNonTerminating[possible_value],
            (input - round(+possible_value, round_target)) ** 2,
          ])
      }
      // Check irrationals
      for (let possible_value in this.table) {
        if (this.table.hasOwnProperty(possible_value))
          diff_of_squares.push([
            this.table[possible_value],
            (input - round(+possible_value, round_target)) ** 2,
          ])
      }
    }

    diff_of_squares.sort(function (a, b) {
      return a[1] - b[1]
    })
    // This will always have more than 5 items
    // @ts-ignore
    return diff_of_squares.slice(0, 5)
  }

  private fillTable(
    irrationals: [string, number, number][],
    depth: number = 5
  ) {
    // Fill with rationals
    this.simpleRational(24)
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
    // Fill the rational table
    const terminating_fractions = generateTerminatingSternBorcotTreeToDepth(
      depth,
      20
    )
    for (const fraction of terminating_fractions) {
      const result = fraction.numerator / fraction.denominator
      this.rationalTableTerminating[result] = {
        numerator: [fraction.numerator],
        denominator: [fraction.denominator],
      }
    }

    const non_terminating = generateTerminatingSternBorcotTreeToDepth(
      depth,
      20,
      false
    )
    for (const fraction of non_terminating) {
      const result = fraction.numerator / fraction.denominator
      this.rationalTableNonTerminating[result] = {
        numerator: [fraction.numerator],
        denominator: [fraction.denominator],
      }
    }
  }

  private simpleIrrationalNumerator(
    irrational: number,
    irrational_string: string,
    depth: number
  ) {
    // TODO: remove redundancy on tree generation
    const fractions = generateSternBorcotTreeToDepth(depth)
    for (const fraction of fractions) {
      const result = (irrational * fraction.numerator) / fraction.denominator
      this.table[result] = {
        numerator: [irrational_string, fraction.numerator],
        denominator: [fraction.denominator],
      }
    }
  }

  private simpleIrrationalDenominator(
    irrational: number,
    irrational_string: string,
    depth: number
  ) {
    const fractions = generateSternBorcotTreeToDepth(depth)
    for (const fraction of fractions) {
      const result = fraction.numerator / (fraction.denominator * irrational)
      this.table[result] = {
        numerator: [fraction.numerator],
        denominator: [irrational_string, fraction.denominator],
      }
    }
  }
}

export { IrrationalManager }
