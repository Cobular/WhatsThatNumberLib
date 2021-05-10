import { IrrationalManager } from "./IrrationalManager"

console.time("Init Irrational")
const irrationalManager = new IrrationalManager()
console.timeEnd("Init Irrational")

console.log(irrationalManager.find_many_fractions(3.14, 3))
