const objectDeepMap = (obj, fn) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      objectDeepMap(obj[key], fn)
      continue
    }

    obj[key] = fn(key, obj[key])
  }
}

module.exports = objectDeepMap
