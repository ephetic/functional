const tape = require('tape')
const {matcher, partial} = require('../src')
const _ = require('lodash')

tape('Match on constants or predicate functions', t => {
  const isHi = matcher(['hi', true])

  t.ok(isHi('hi'), `Matched 'hi'`)
  t.notOk(isHi('hello'), `Doesn't match 'hello`)

  const fact = matcher(
    [1, 1],
    [matcher, n => n * fact(n-1)]
  )

  const fibo = matcher(
    [n => n <= 2, 1],
    [matcher, n => fibo(n-1) + fibo(n-2)]
  )

  const range = _.range(1,10)
  t.ok(_(range).every(n => fibo(n) === _fibo(n)), `fibo works`)
  t.ok(_(range).every(n => fact(n) === _fact(n)), `fact works`)

  t.end()

  function _fibo(n) {
    if (n <= 2) return 1
    return _fibo(n-1) + _fibo(n-2)
  }

  function _fact(n) {
    if (n == 1) return 1
    return n * _fact(n-1)
  }
})

tape('Match with RegExp', t => {
  const isLikeHi = matcher([/.*hi.*/, s => `${s} is close enough`])

  t.ok(isLikeHi('hi'), `Matches 'hi'`)
  t.ok(isLikeHi('shiny'), `Matching 'shiny'`)
  t.notOk(isLikeHi('hello'), `Doesn't match 'hello'`)
  t.end()
})


tape('Match on argument types, values, and don\'t-cares', t => {
  const secondIsNumber = matcher(
    [[matcher, Number], (a,b) => `${b} is a Number`],
    [matcher, (a,b) => `${b} is not a Number`]
  )

  t.equal(secondIsNumber('asdf', 2), '2 is a Number', `Second arg is Number`)
  t.equal(secondIsNumber(2, 'asdf'), 'asdf is not a Number', `Second arg is not Number`)
  t.end()
})

tape('Match on given object keys', t => {
  const isDuckman = matcher([{name: 'Duckman', age:40}, true])
  t.ok(isDuckman({name: 'Duckman', age:40}), `Object matches at given keys`)
  t.notOk(isDuckman({name: 'Duckman'}), `Object is missing key`)
  t.notOk(isDuckman({name: 'Birdperson', age:40}), `Object has incorrect value at key`)

  const isDuckPerson = matcher([{name: matcher, age: matcher}, true])
  t.ok(isDuckPerson({name: 'Rick', age: 55}), `Matches property types at keys`)
  t.end()
})

tape('Partially apply arguments', t => {
  const add = (a,b) => a + b
  t.equal(3, partial(add)(1,2), '0 bound arguments')
  t.equal(3, partial(add, 1)(2), '1 bound arguments')
  t.equal(3, partial(add, partial, 1)(2), '1 bound arguments out-of-order')
  t.end()
})