import {IrrationalManager} from "./IrrationalManager";
import math = require("mathjs");

let manager: IrrationalManager

beforeAll(function () {
  manager = new IrrationalManager()
})

const numberConversionTestMatrix: [number, string | undefined][] = [
  [3.141, "(pi*1)/1"],
  [3.14159265359, "(pi*1)/1"],
  [1.41421356237, "(√2*1)/1"],
  [1.73205080757, "(√3*1)/1"],
  [1.732, "(√3*1)/1"],
  [3.46410161514, "(√3*2)/1"],
  [3.464, "(√3*2)/1"],
  [0.866025403784, "(√3*1)/2"],
  [2.59807621135, "9/(2*√3)"],
  [2.598, "9/(2*√3)"],
  [8.66025403784, "(√3*5)/1"],
  [8.66, "(√3*5)/1"],
  [15.8745078664, "(√7*6)/1"],
  [8.660, "(√3*5)/1"],
  [3.9686269666, "(√7*3)/2"],
  [3.9686, "(√7*3)/2"],
  [0.81201169942, "6/(1*e²)"],
  [0.8120, "6/(1*e²)"],
  [3.968 , "(√7*3)/2"],
  [0.707106781186547572737310929369, "(√2*1)/2"],
  [0.14474454806, "10/(7*pi²)"],
  [2.449489742783177881335, "(√3/√2*2)/1"],
  [0.1, "1/10"],
  [0.33333, "1/3"],
  [2, "2/1"],
  [7, "7/1"],
  [20, "20/1"],
  [0.05, "1/20"],
  [0.09090, "1/11"],
  [0.11111, "1/9"],
]

test.each(numberConversionTestMatrix)("Searching for %p returns %p", function (input, result) {
  const best_fraction = manager.find_best_fraction(input)
  // @ts-ignore
  expect(best_fraction[0]).toBe(result)
})

const randomNumberConversionTestMatrix: [number][] = [
  [0.891794],
  [0.173926],
  [1.4398074],
  [0.173926],
  [0.173926],
  [0.173926],
  [0.0739015],
  [1.3337879],
  [9.8885986],
  [9.888],
  [4.8853],
  [2.367331286405000678740861985716],
  [9.555156223941841275859587767627],
  [3.360841885243382787251675836160],
  [3.466260831125783870021450638887],
  [2.649934076069233590544627077179],
]

test.each(randomNumberConversionTestMatrix)("Searching for %p returns undefined", function (input) {
  const best_fraction = manager.find_best_fraction(input)
  // @ts-ignore
  expect(best_fraction).toBeUndefined()
})

