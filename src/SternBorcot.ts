import { Fraction } from "./Utils"

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

export function generateScaledSternBorcotTreeToDepth(
  depth: number
): Fraction[] {
  let fractions: Set<Fraction> = new Set()

  function recursiveGenerateScaledSternBorcotTreeToDepth(
      depth: number,
    twos: number = 0,
    count: number = 0
  ): void {
    count++
    const n = twos
    for (let i = n; i > -1; i--) generate_with_numerators(n, i)

    // Check to see if we've gone too deep
    if (count > depth) return
    // Check to see if we're close enough to the target

    recursiveGenerateScaledSternBorcotTreeToDepth(depth, n + 1, count)
    return
  }

  function generate_with_numerators(twos: number, fives: number) {
    const denominator = 2 ** twos * 5 ** fives
    let numerator = 1
    while (true) {
      //1
      if (numerator > denominator) break
      fractions.add({ numerator: numerator, denominator: denominator })
      numerator += 2

      //3
      if (numerator > denominator) break
      fractions.add({ numerator: numerator, denominator: denominator })
      numerator += 4

      //7
      if (numerator > denominator) break
      fractions.add({ numerator: numerator, denominator: denominator })
      numerator += 2

      //9
      if (numerator > denominator) break
      fractions.add({ numerator: numerator, denominator: denominator })
      numerator += 2
    }
  }

  recursiveGenerateScaledSternBorcotTreeToDepth(depth)

  return Array.from(fractions)
}

// Generate a Stern Borcot Tree to a given depth, stopping if the numerator and denominator are greater than cutoff,
//  which helps to mitigate the depth of the middle of the tree.
export function generateTerminatingSternBorcotTreeToDepth(
  depth: number,
  cutoff: number,
  terminating: boolean = true
): Fraction[] {
  let fractions: Fraction[] = []

  function recursiveGenerateTerminateSternBorcotTreeToDepth(
    left_n: number,
    left_d: number,
    right_n: number,
    right_d: number,
    count: number = 0
  ): void {
    count++
    const center_n: number = left_n + right_n
    const center_d: number = left_d + right_d
    if (checkTerminating(center_d) === terminating)
      fractions.push({
        numerator: center_n,
        denominator: center_d,
      })
    // Check to see if we've gone too deep, or if we should abort because we've hit the cutoff
    if (count > depth || center_d > cutoff || center_n > cutoff) return
    // Check to see if we're close enough to the target
    recursiveGenerateTerminateSternBorcotTreeToDepth(
      center_n,
      center_d,
      right_n,
      right_d,
      count
    )
    recursiveGenerateTerminateSternBorcotTreeToDepth(
      left_n,
      left_d,
      center_n,
      center_d,
      count
    )
    return
  }

  recursiveGenerateTerminateSternBorcotTreeToDepth(0, 1, 1, 0)

  return fractions
}

// Returns true if terminates, false if does not
function checkTerminating(denominator: number) {
  while (denominator % 2 === 0) {
    denominator /= 2
  }
  while (denominator % 5 === 0) {
    denominator /= 5
  }
  return denominator == 1
}
