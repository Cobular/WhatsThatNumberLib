import math = require("mathjs")
import { IrrationalManager } from "./managers/IrrationalManager"
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

console.log(irrationalManager.find_many_fractions(3.14, 3))
