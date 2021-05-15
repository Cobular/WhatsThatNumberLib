import { IrrationalManager } from "../src/IrrationalManager"
import { performance } from "perf_hooks"
import { LookupManager } from "../src/Utils"
import { LiamManager } from "../src/LiamManager"

function testPerf(manager: typeof LiamManager | typeof IrrationalManager) {
  const startTime = performance.now()
  const manager_instance = new manager(true)
  const endTime = performance.now()
  const time = endTime - startTime
  console.log(`${manager_instance.constructor.name} constructed in ${time} ms`)
  console.log(`${Object.keys(manager_instance.rationalTable).length}`)
  return time
}

test("IrrationalManager should be faster than 100 ms to initialize", () => {
  const time = testPerf(IrrationalManager)
  expect(time).toBeLessThan(100)
})

test("LiamManager should be faster than 100 ms to initialize", () => {
  const time = testPerf(LiamManager)
  expect(time).toBeLessThan(100)
})
