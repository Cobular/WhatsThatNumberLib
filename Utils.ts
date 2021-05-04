export interface Fraction {
  numerator: number
  denominator: number
}

export function generateSternBorcotTreeToDepth(depth: number): Fraction[] {
  let fractions: Fraction[] = []

  function recursiveGenerateSternBorcotTreeToDepth(
      left_n: number,
      left_d: number,
      right_n: number,
      right_d: number,
      count: number = 0
  ): void {
    count++
    const center_n: number = left_n + right_n
    const center_d: number = left_d + right_d
    fractions.push({
      numerator: center_n,
      denominator: center_d,
    })
    // Check to see if we've gone too deep
    if (count > depth) return
    // Check to see if we're close enough to the target
    recursiveGenerateSternBorcotTreeToDepth(
        center_n,
        center_d,
        right_n,
        right_d,
        count
    )
    recursiveGenerateSternBorcotTreeToDepth(
        left_n,
        left_d,
        center_n,
        center_d,
        count
    )
    return
  }

  recursiveGenerateSternBorcotTreeToDepth(0, 1, 1, 0)

  return fractions
}

export function round(input: number, size: number): number {
  return +input.toFixed(size)
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

export abstract class LookupManager {
  public table: FractionTable

  protected constructor() {
    this.table = {}
  }

  abstract lookup(input: number): ProcessNumberResults
}
