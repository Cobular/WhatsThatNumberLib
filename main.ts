import { IrrationalManager } from "./managers/IrrationalManager"
import { RationalManager } from "./managers/RationalManager"
import { LookupManager, round } from "./managers/Utils"

console.time("Init Irrational")
const irrationalManager = new IrrationalManager()
console.timeEnd("Init Irrational")

function selfTest(manager: LookupManager, round_pt: number) {
  const test: [string, number][] = []
  const numbers = Object.keys(irrationalManager.table)
  for (let i = 0; i < 100; i++) {
    const key = numbers[Math.floor(Math.random() * numbers.length)]
    // @ts-ignore
    test.push([irrationalManager.table[key], +key])
  }

  let counter = 0
  test.forEach((value) => {
    const result = manager.find_many_fractions(round(value[1], round_pt), round_pt)
    counter += +result[0][1]
    if (value[0] === result[0][0]) {
      // console.log(`Test Passed for ${value[0]}: ${value[1]}. Certainty: ${result[0][1]}`)
    } else {
      // console.error(`Test FAILED for ${value[0]}: ${value[1]}. Best Certainty:  ${result[0][1]}`)
    }
  })
  // @ts-ignore
  console.log(`${round_pt},${counter / 100}`)
}

// console.time("Test Irrational")
// for (let key of Array(20).keys()) {
//   selfTest(irrationalManager, key)
// }
// console.timeEnd("Test Irrational")
const rationalManager = new RationalManager()

console.log(irrationalManager.find_many_fractions(3.14, 3))
// console.log(rationalManager.lookup(2 * Math.sqrt(2)))
// [
//   [ '4/1*√2', 0 ],
//   [ '√2*2/1', 4.930380657631324e-32 ],
// ]
// [
//   [ '√2*2/1', 0 ],
//   [ '4/1*√2', 7.888609052210118e-31 ],
// ]

// console.log(irrationalManager.irrationalLookup( 0.7071067811865475))
// console.log(irrationalManager.irrationalLookup(0.696969696969))
//
// console.time("Init Rational")

// console.timeEnd("Init Rational")
//
// console.time("Test Rational")
// selfTest(rationalManager)
// console.timeEnd("Test Rational")
// //
// console.time("Search Rational")
// console.log(rationalManager.lookup( 2.5))
// console.timeEnd("Search Rational")
// console.log(rationalManager.lookup(round(0.38649325194864675, 10)))
