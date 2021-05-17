import { DefaultParser, LatexParser } from "../src/OutputParsers"
import { ResultFrac } from "../src/Utils"

const defaultParserTestMatrix: [ResultFrac, string][] = [
  [
    {
      numerator: [3],
      denominator: [4],
    },
    "3/4",
  ],
  [
    {
      numerator: [3, "√3"],
      denominator: [4],
    },
    "(3*√3)/4",
  ],
  [
    {
      numerator: [3, "√3"],
      denominator: [4, "√2"],
    },
    "(3*√3)/(4*√2)",
  ],
  [
    {
      numerator: [3, 2],
      denominator: [4, "√2"],
    },
    "(3*2)/(4*√2)",
  ],
  [
    {
      numerator: [3, 2],
      denominator: [1],
    },
    "(3*2)/1",
  ],
]

test.each(defaultParserTestMatrix)(
  "Default converter correctly formats %result",
  function (input, result) {
    expect(DefaultParser(input)).toBe(result)
  }
)

const latexParserTestMatrix: [ResultFrac, string][] = [
  [
    {
      numerator: [3],
      denominator: [4],
    },
    "\\frac{3}{4}",
  ],
  [
    {
      numerator: [3, "√3"],
      denominator: [4],
    },
    "\\frac{3*\\sqrt{3}}{4}",
  ],
  [
    {
      numerator: [3, "√3"],
      denominator: [4, "√2"],
    },
    "\\frac{3*\\sqrt{3}}{4*\\sqrt{2}}",
  ],
  [
    {
      numerator: [3, 2],
      denominator: [4, "√2"],
    },
    "\\frac{3*2}{4*\\sqrt{2}}",
  ],
  [
    {
      numerator: [3, 2],
      denominator: [1],
    },
    "\\frac{3*2}{1}",
  ],
]

test.each(latexParserTestMatrix)(
  "Latex converter correctly formats %result",
  function (input, result) {
    expect(LatexParser(input)).toBe(result)
  }
)
