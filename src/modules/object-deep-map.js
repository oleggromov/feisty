const objectDeepMap = (source, fn) => {
  const result = {}

  for (const key in source) {
    if (typeof source[key] === 'object') {
      result[key] = objectDeepMap(source[key], fn)
    } else {
      result[key] = fn(key, source[key])
    }
  }

  return result
}

module.exports = objectDeepMap
