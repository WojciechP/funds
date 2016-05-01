# Functional Utilities and Data Structures

[![Travis
branch](https://img.shields.io/travis/WojciechP/funds/master.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/v/funds.svg?maxAge=2592000)]()


This package provides a collection of tools for functional programming. They are
all strongly typed for easy consumption from TypeScript.

The package contains a set of ES6 modules, so you will most likely need a
preprocessor and polyfills if you intend to use it in a browser.

`npm install --save funds` will get you started.


# Package contents

## `funds/core`

The main reason for this module are functions with extra helpers
for composition and currying:

```.ts
// in funds/core:

interface Fun<A, B> {
  (a: A): B
  andThen<C>(f: (b: B) => C) => Fun<A, C>
}

export function mkFun<A, B>(f: (a: A) => B): Fun<A, B>


export interface Fun2<A1, A2, B> extends Fun<A1, Fun<A2, B>> {
  (a1: A1, a2: A2): B
  (a1: A1): Fun<A2, B>
  andThen<C>(f: (partial: (a2: A2) => B) => C): Fun<A1, C>
}

export function mkFun2<A1, A2, B>(f: (a1: A1, a2: A2) => B): Fun<A1, A2, B>
```


A `Fun<A, B>` is just a function that takes `A` and produces `B`, but which can
be easily composed using `andThen` method:

```.js
// your code:

var f = mkFun(n => n+2)
var g = mkFun(n => 2*n)

var composed = f.andThen(g)

console.log(composed(6))  // prints (6+2)*2 = 16
```

A `Fun2<A1, A2, B>` is a two-argument function which can be composed or curried:

```.js
// your code:

var f = mkFun2((a, b) => a + 2*b)
var addFour = f(4)  // this is now a partially applied function, with a=4 and waiting for b

console.log(addFour(1))  // prints 4 + 2*1 = 6
console.log(addFour.andThen(t => t*3)(7))  // prints (4 + 2*x)*3 for x = 7, which is 54

// let consider a wrapper that wraps numeric functions:
var wrap = function(f) {
  return function wrapped(n) {
    console.log(`Got argument ${n}`)
    var result = f(b)
    console.log(`Returning ${result}`)
    return result
  }
}

const addFourWithLogging = f.andThen(wrap)(4)
console.log(addFourWithLogging(5))
// > 'Got argument 5'
// > 'Returning 14'
// > '14'
```

## `funds/data`: Universal Immutable Data Types

### Maybe

```.js
import { Maybe, just, nothing } from 'funds/data'

var j5 = just(5)
console.log(j5.isJust) // true

var j6 = j5.map(t => t+1)
console.log(j6.run) // 6

var j7 = j6.flatMap(t => just(t+1))
console.log(j7)  // Just(7)
console.log(j6.flatMap(t => nothing())) // Nothing

console.log(nothing().isJust)  // false
console.log(nothing().run)  // null
```


### Either

```.js
import { Either, left, right } from 'funds/data'

var r5 = right(5)

var r6 = r5.map(t => t+1)
var r7 = r5.flatMap(t => right(t+1))
var le = r7.flatMap(t => left(-t))
var result = le.cata(
  function ifLeft(leftVal) { return `Negative: ${leftVal}` },
  function ifRight(rightVal) { return `Positive: ${rightVal}` }
)
console.log(result)  // 'Negative: -7'
```


## `funds/optics`: Getters, Setters, Lenses, and Prisms

`Optics` are various flavors of functional references to a part of bigger data
structure. They crucial kind is a lens:

```.js
import { mkLens } from 'funds/optics'

const john = { 
  name: 'John',
  email: 'john@example.com'
}

const email = mkLens(
  function get(person) { return person.email },
  function set(email, person) { return { name: person.name, email: email }}
)

console.log(email.get(john))
// > 'john@example.com'
console.log(email.modify(oldEmail => oldEmail.replace('.com', '.org')))
// > { name: 'John', email: 'john@example.org' }
```

All optics are functional tools, meaning they do not mutate data. The functions
`set` and `modify` return updated copies of original data instead.
