module.exports = function match(...patterns){
  return function(...args) {
    for (let [cond, _fn] of patterns) {
      const fn = typeof _fn == 'function' ? _fn : () => _fn

      if ('function' == typeof cond && cond !== match) cond = cond(...args)
      else if (Array.isArray(cond))       cond = eq(cond, args)
      else                                cond = eq([cond], args)
      if(cond) return fn(...args)
    }
  }
  function eq(a,b) {
    if (a === b || a === match) return true
    if (!a || !b) return false
    for (let key in Object.keys(a)) {
      if (a[key] === match) continue
      if ('object' == typeof a[key] && a[key].constructor == RegExp) return a[key].test(b[key])
      if (!b.hasOwnProperty(key)) return false
      if (a[key] === b[key]) continue
      if ('string' == typeof b[key] && a[key] !== String) return false
      if ('number' == typeof b[key] && a[key] !== Number) return false
      if ('object' == typeof b[key] && a[key] === b.constructor) continue
      return eq(a[key], b[key])
    }
    return true
  }
}
