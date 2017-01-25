# functional

## Installation
```
yarn add --save ephetic/functional
```

## Erlang-inspired pattern matching
Patterns are checked in order, stopping with the first match.  If no patterns match, the generated function will return `undefined` when called.

The pattern wildcard is the function itself (and can be aliased to any symbol you prefer).


### Examples
```
import { matcher as m } from 'functional-pattern-matching'
```

#### Match on constants or predicate functions
```
const isHi = m(['hi', true])

console.log(isHi('hi'))     // true
console.log(isHi('hello'))  // undefined

const fact = m(
  [1, 1],
  [m, n => n * fact(n-1)]
)

const fibo = m(
  [n => n <= 2, 1],
  [m, n => fibo(n-1) + fibo(n-2)]
)
```

#### Match with RegExp
```
const isLikeHi = m([/.*hi.*/, s => `${s} is close enough`])
```

#### Match on argument types, values, and don't-cares 
```
const secondIsNumber = m(
  [ [m, Number], (a,b) => console.log(`${b} is a Number`)],
  [ m,           (a,b) => console.log(`${b} is not a Number`)]
)

secondIsNumber('asdf', 2)   // 2 is a Number
secondIsNumber(2, 'asdf')   // asdf is not a Number
```
Note: since an array literal condition is used to represent the arguments list, to test against an actual array wrap it in a dummy object.

#### Match on given object shape
```
const isDuckman = m([{name: 'Duckman', age:40}, () => console.log('Duuuuckmaaaaan!')])
isDuckman({name: 'Duckman', age:40})  // Duuuuckmaaaaan!
isDuckman({name: 'Duckman'})          // undefined

const isDuckPerson = m([{name: m, age: m}, () => console.log('wubba lubba dub dub')])
isDuckPerson({name: 'Rick', age: 55}) // wubba lubba dub dub
```

## Partial function application
Uses itself as wildcard to leave arbitrary parameters unbound.
```
import { partial as p } from 'functional'
const add = (a,b) => a + b
const div = (a,b) => a / b

const add1 = p(add, 1)
const halve = p(div, p, 2)
```
