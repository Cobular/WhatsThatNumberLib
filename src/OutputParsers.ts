import {
  ResultFrac,
  ResultFracElement,
  SimpleIrrationals,
  SimpleIrrationalsType,
  StringIsSimpleIrrational,
} from "./Utils"

export type ParserFunc = (frac: ResultFrac) => string | ResultFrac

function IrrationalStringToLatex(irrationalString: string): string | undefined {
  if (StringIsSimpleIrrational(irrationalString)) {
    switch (irrationalString) {
      case "pi":
        return "\\pi"
      case "pi²":
        return "\\pi^2"
      case "φ":
        return "\\varphi"
      case "e":
        return "e"
      case "e²":
        return "e^2"
      case "√2":
        return "\\sqrt{2}"
      case "√3":
        return "\\sqrt{3}"
      case "√5":
        return "\\sqrt{5}"
      case "√7":
        return "\\sqrt{7}"
    }
  }
  return undefined
}

export const DefaultParser: ParserFunc = (frac) => {
  let numerator = frac.numerator.join("*")
  if (frac.numerator.length > 1) numerator = `(${numerator})`
  let denominator = frac.denominator.join("*")
  if (frac.denominator.length > 1) denominator = `(${denominator})`
  return `${numerator}/${denominator}`
}

function LatexFlattenInput(input: ResultFracElement[]): string {
  let str = ""
  input.forEach((value) => {
    if (typeof value === "number") {
      if (str !== "") str += "*"
      str += value
      return
    }
    const latex = IrrationalStringToLatex(value)
    if (latex !== undefined) {
      if (str !== "") str += "*"
      str += latex
      return
    }
  })
  return str
}

export const LatexParser: ParserFunc = (frac) => {
  let numerator: string = LatexFlattenInput(frac.numerator)
  let denominator: string = LatexFlattenInput(frac.denominator)
  return `\\frac{${numerator}}{${denominator}}`
}
//
// console.log(
//   DefaultParser({
//     numerator: [3],
//     denominator: [4, "e²"],
//   })
// ) // (3*3)/(4)
//
// console.log(
//   LatexParser({
//     numerator: [3, 3],
//     denominator: [4, "e²"],
//   })
// ) // (3*3)/(4)
