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

// export function generateScaledSternBorcotTreeToDepth(
//   depth: number
// ): Fraction[] {
//   let fractions: Set<Fraction> = new Set()
//
//   function recursiveGenerateScaledSternBorcotTreeToDepth(
//     twos: number = 0,
//     fives: number = 0,
//     count: number = 0
//   ): void {
//     count++
//     const n = two
//     const m = fives
//
//     fractions.push({numerator: 1, denominator: (2 ** m) * (5 ** n)})
//
//     // Check to see if we've gone too deep
//     if (count > depth) return
//     // Check to see if we're close enough to the target
//
//     if (m > n) recursiveGenerateScaledSternBorcotTreeToDepth()
//     if (n > m) recursiveGenerateScaledSternBorcotTreeToDepth()
//     return
//   }
//
//   recursiveGenerateScaledSternBorcotTreeToDepth()
//
//   return fractions
// }

export function generateTerminatingSternBorcotTreeToDepth(
  depth: number
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
    if (checkTerminating(center_d))
      fractions.push({
        numerator: center_n,
        denominator: center_d,
      })
    // Check to see if we've gone too deep
    if (count > depth) return
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
