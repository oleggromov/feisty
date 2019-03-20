const objectDeepMap = (obj, fn) => {
  if (typeof obj !== 'object') {
    return
  }

  const queue = [obj]
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i]

    for (let key in current) {
      if (typeof current[key] === 'object') {
        queue.push(current[key])
        continue
      }

      fn(key, current[key])
    }
  }
}

module.exports = objectDeepMap
