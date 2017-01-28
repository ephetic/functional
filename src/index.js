
const matcher = (...patterns) => {
  return function M(...args) {
    for (let [cond, _fn] of patterns) {
      const fn = typeof _fn == 'function' ? _fn : () => _fn
      if (cond === matcher)                 cond = () => true
      else if ('function' == typeof cond) cond = cond(...args)
      else if (Array.isArray(cond))       cond = eq(cond, args) 
      else                                cond = eq([cond], args)
      if(cond) return fn(...args)
    }
  }
  function eq(cond,val) {
    if (cond === matcher) return true
    if (cond === val)     return true
    if (cond === val.constructor) return true
    if (cond instanceof RegExp)   return cond.test(val)
    if (typeof cond === 'function') return cond(val)
    if (typeof cond !== 'object') return false
    if (Array.isArray(cond) && (!Array.isArray(val) || cond.length != val.length)) return false
    
    for (let key of Object.keys(cond)) {
      if (!val.hasOwnProperty(key)) return false
      if (!eq(cond[key], val[key])) return false
    }
    return true
  }
}

const partial = (fn, ...parts) => (...args) => {
  let params = Array(parts.length)
  let [pix, aix] = [0, 0]
  while (pix < parts.length) {
    let part = parts[pix]
    part = part === partial ? args[aix++] : part
    params[pix++] = part
  }
  params = params.concat(args.slice(aix))
  return fn(...params)
}

module.exports = {matcher, partial}