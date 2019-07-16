const objectDeepMap = (source, fn) => {
  const result = {}

  for (const key in source) {
    if (Array.isArray(source[key])) {
      result[key] = source[key].map(value => {
        if (typeof value === 'object') {
          return objectDeepMap(value, fn)
        }
        return fn(null, value)
      })
    } else if (source[key] instanceof Date) {
      result[key] = source[key]
    } else if (typeof source[key] === 'object') {
      result[key] = objectDeepMap(source[key], fn)
    } else {
      result[key] = fn(key, source[key])
    }
  }

  return result
}

module.exports = objectDeepMap
