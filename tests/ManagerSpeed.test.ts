import { IrrationalManager } from "../src/IrrationalManager"
import { performance } from "perf_hooks"

function testPerf(manager: typeof IrrationalManager) {
  const startTime = performance.now()
  const manager_instance = new manager(true)
  const endTime = performance.now()
  const time = endTime - startTime
  console.log(`${manager_instance.constructor.name} constructed in ${time} ms`)
  console.log(`${Object.keys(manager_instance.rationalTableTerminating).length}`)
  return time
}

test("IrrationalManager should be faster than 100 ms to initialize", () => {
  const time = testPerf(IrrationalManager)
  expect(time).toBeLessThan(100)
})
