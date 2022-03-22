# What's That Number - Library
### What this is
A library which takes an arbitrary decimal number and tries to figure out if it's a 1) a rational number or 2) a rational fraction times an irrational number.

Put another way, it can take a number like `2.59807621135` and tell you that it's `9/(2*√3)`! It works well for numbers beyond about 3 sigfigs. Any below that and there's just not enough information to figure out what you mean. It also only works for things multiplied or divided by a relatively common set of irrationals: pi, pi², φ, e, e², √2, √3, √3/√2, √5, √7. It also will say if your input number is probably* not a fraction of an irrational.

This brings us to...

### What this isn't
* A mathematically robust system to solve this problem. This will give you a good enough reckon for almost anything you want to do, but it's not mathematically probable or robust in any way.
* [Inverse Symbolic Calculator](http://wayback.cecm.sfu.ca/projects/ISC/ISCmain.html) - This contains a table of millions and millions of numbers. It's more robust if you have 15+ decimal places, but frankly it's more of a party trick than something usable because just rounding the last decimal is enough to throw it off, and almost every single number you enter will have some match.
* Something that can give you solid guarantees. This is optimized to work with the kind of sigfigs you might get out of a calendar, which is relatively low sigfigs for this kind of problem. It works pretty well for about 3, and starts really working well around 5 sigfigs. As a consequence, we only search for a pretty common set of rational fractions times and divided by a relatively common set of irrationals (seen above). 
  * It's also optimized to tell you if something probably isn't a rational fraction, meaning 1) it won't tell you that 0.459 is 459/1000 (that's just not useful information) and 2) it's intentionally limited to relitavely common irrationals.
  
# Docs
See https://github.com/Cobular/WhatsThatNumberExtension for an implementation of this in a Chrome extension.

Nothing like an example to see how something works:

```typescript
import { IrrationalManager } from "whatsthatnumber_lib"

const manager = new IrrationalManager()

console.log(manager.find_best_fraction(0.5))  // [ '1/2', 0 ]
console.log(manager.find_best_fraction(3.141))  // [ '(pi*1)/1', 9.999999999997797e-7 ]
console.log(manager.find_best_fraction(3.14159265359))  // [ '(pi*1)/1', 0 ]
console.log(manager.find_best_fraction(0.14474454806))  // [ '10/(7*pi²)', 0 ]
console.log(manager.find_best_fraction(1.3337879))  // undefined
console.log(manager.find_best_fraction(2.367331286405000678740861985716))  // undefined
```

### `new IrrationalManager(generate: boolean = false)`
Constructs a new IrrationalManager. If generate is true, the library re-generates the set of irrational numbers on initialization. Otherwise, it loads a pre-generated set which is much faster, and 99.99% chance what you want. 

### `manager.find_best_fraction(input: number): [string, number] | undefined`
Tries to find the best fraction for a given input and returns it as a string. If it thinks the input isn't an irrational it has inside, it returns undefined. The return `string` is in the form `(<irrational>*<digit>)/<digit>` if the irrational is in the numerator and `<digit>/(<digit>*<irrational>)` if the irrational is in the denominator, and the `number` is the squared difference between the input number and the given fraction. Zero means it's an exact match when rounded to the same number of sigfigs (or we lost the squared difference to the depths of floating point precision).

**Peculiarities**:
* Things are not yet simplified. This means `pi` is returned as `(pi*1)/1`. I'll work out some kind of symbolic simplification thing eventually.
* `9/(2*√3)` is (sometimes) a distinct case from `(√3*3)/2`, which means you might get the opposite case from what you're looking for. I'll also deduplicate these at some point. This happens because of floating point errors I think, frankly I haven't investigated it too hard but this should be solvable. PRs welcome!
