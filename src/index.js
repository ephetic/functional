module.exports = function match(...patterns){
  return function M(...args) {
    for (let [cond, _fn] of patterns) {
      const fn = typeof _fn == 'function' ? _fn : () => _fn
      if (cond === match)                 cond = () => true
      else if ('function' == typeof cond) cond = cond(...args)
      else if (Array.isArray(cond))       cond = eq(cond, args)
      else                                cond = eq([cond], args)
      if(cond) return fn(...args)
    }
  }
  function eq(cond,val) {
    if (cond === match)   return true
    if (cond === val)     return true
    if (cond === val.constructor) return true
    if (cond instanceof RegExp)   return cond.test(val)
    if (typeof cond !== 'object') return false

    for (let key of Object.keys(cond)) {
      if (!val.hasOwnProperty(key)) return false
      if (!eq(cond[key], val[key])) return false
    }
    return true
  }
}

