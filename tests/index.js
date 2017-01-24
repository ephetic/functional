const tape = require('tape')
const match = require('../src')
const _ = require('lodash')

tape('Match on constants or predicate functions', t => {
  const isHi = match(['hi', true])

  t.ok(isHi('hi'), `Matched 'hi'`)
  t.notOk(isHi('hello'), `Doesn't match 'hello`)

  const fact = match(
    [1, 1],
    [match, n => n * fact(n-1)]
  )

  const fibo = match(
    [n => n <= 2, 1],
    [match, n => fibo(n-1) + fibo(n-2)]
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
  const isLikeHi = match([/.*hi.*/, s => `${s} is close enough`])

  t.ok(isLikeHi('hi'), `Matches 'hi'`)
  t.ok(isLikeHi('shiny'), `Matching 'shiny'`)
  t.notOk(isLikeHi('hello'), `Doesn't match 'hello'`)
  t.end()
})


tape('Match on argument types, values, and don\'t-cares', t => {
  const secondIsNumber = match(
    [[match, Number], (a,b) => `${b} is a Number`],
    [match, (a,b) => `${b} is not a Number`]
  )

  t.equal(secondIsNumber('asdf', 2), '2 is a Number', `Second arg is Number`)
  t.equal(secondIsNumber(2, 'asdf'), 'asdf is not a Number', `Second arg is not Number`)
  t.end()
})

tape('Match on given object keys', t => {
  const isDuckman = match([{name: 'Duckman', age:40}, true])
  t.ok(isDuckman({name: 'Duckman', age:40}), `Object matches at given keys`)
  t.notOk(isDuckman({name: 'Duckman'}), `Object is missing key`)
  t.notOk(isDuckman({name: 'Birdperson', age:40}), `Object has incorrect value at key`)

  const isDuckPerson = match([{name: match, age: match}, true])
  t.ok(isDuckPerson({name: 'Rick', age: 55}), `Matches property types at keys`)
  t.end()
})
