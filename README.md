# Match

### VanillaJS Erlang-inspired pattern matching
Patterns are checked in order, stopping with the first match.  If no patterns match, the generated function will return `undefined` when called.

The pattern wildcard is the `match` function itself (and can be aliased to any symbol you prefer).

## Examples

### Match on constants or predicate functions
```
const isHi = match(['hi', true])

console.log(isHi('hi'))     // true
console.log(isHi('hello'))  // undefined

const fact = match(
  [1, 1],
  [match, n => n * fact(n-1)]
)

const fibo = match(
  [n => n <= 2, 1],
  [match, n => fibo(n-1) + fibo(n-2)]
)
```

### Match with RegExp
```
const isLikeHi = match([/.*hi.*/, s => `${s} is close enough`])
```

### Match on argument types, values, and don't-cares 
```
const __ = match
const secondIsNumber = match(
  [[ __, Number], (a,b) => console.log(`${b} is a Number`)],
  [ __, (a,b) => console.log(`${b} is not a Number`)]
)

secondIsNumber('asdf', 2)   // 2 is a Number
secondIsNumber(2, 'asdf')   // asdf is not a Number
```

# TODO
### Match on given object shape
This should accompany a much needed refactor to separate the logic for the various conditions so that it is less of a tasty ragu.  

```
const isDuckman = match([{name: 'Duckman', age:40}, () => console.log('Duuuuckmaaaaan!')])
isDuckman({name: 'Duckman', age:40})

const isDuckperson = match([{name: match, age: match}, () => console.log('yup')])
isDuckperson({name: 'Rick', age: 55})
```

### Array and rest matching
Since arrays are used to represent a parameter pattern, a literal array must be wrapped in an object `{foo: [11,22,33]}`.  However, it would be nice to make sure the `[head, ...rest]` semantics work.