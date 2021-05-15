import { IrrationalManager } from "./IrrationalManager"

console.time("Init Irrational")
const irrationalManager = new IrrationalManager()
console.timeEnd("Init Irrational")

console.log(irrationalManager.find_many_fractions(1.2490457724, 11))
console.log(irrationalManager.find_best_fraction(0.5))
