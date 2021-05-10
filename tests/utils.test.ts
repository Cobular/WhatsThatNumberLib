import { sigfigs } from "../src/Utils"

const significantDigitCountTestMatrix: [number, number][] = [
  [1, 1],
  [1.1, 2],
  [100, 1],
  [101, 3],
  [9999, 4],
  [0.00001, 1],
  [0.11111, 5],
  [3.14, 3],
  [0.00079999999, 8],
  [5.8342999e-8, 8],
  [1.2037062152420224e-37, 17],
  [1.4543e10, 5],
  [120.52e-50, 5],
]

test.each(significantDigitCountTestMatrix)(
    "Check sigfigs for %p with digits",
    function (input, expected) {
      expect(sigfigs(input)).toEqual(expected)
    }
)
