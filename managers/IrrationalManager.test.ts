import {IrrationalManager} from "./IrrationalManager";

let manager: IrrationalManager

beforeAll(function () {
  manager = new IrrationalManager()
})

const numberConversionTestMatrix: [number, string | undefined][] = [
  [3.14, "pi*1/1"],
  [3.14159265359, "pi*1/1"],
  [1.41421356237, "√2*1/1"],
  [1.73205080757, "√3*1/1"],
  [3.46410161514, "√3*2/1"],
  [3.464, "√3*2/1"],
]

test.each(numberConversionTestMatrix)("Searching for %p returns %p", function (input, result) {
  const best_fraction = manager.find_best_fraction(input)
  // @ts-ignore
  expect(best_fraction[0]).toBe(result)
})

const randomNumberConversionTestMatrix: [number][] = [
  [0.891794],
  [0.173926],
]

test.each(randomNumberConversionTestMatrix)("Searching for %p returns undefined", function (input) {
  const best_fraction = manager.find_best_fraction(input)
  // @ts-ignore
  expect(best_fraction).toBeUndefined()
})

