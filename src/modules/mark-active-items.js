const clone = require('./clone')

const wrapMap = obj => {
  if (Array.isArray(obj)) {
    return obj
  }

  if (typeof obj === 'object') {
    return {
      map: function(fn) {
        const result = {}
        for (let key in obj) {
          result[key] = fn(obj[key], key)
        }
        return result
      }
    }
  }
}

module.exports = (items, url) => {
  if (!url.match(/^\//)) {
    throw new Error('markActiveItems only works for absolute URLs')
  }

  // Remove trailing slashes
  const currentUrl = url.replace(/\/+$/, '')

  return wrapMap(clone(items)).map(item => {
    const condition = currentUrl.length === 0
      ? item.url === '/'
      : item.url.match(new RegExp(`^${currentUrl}`))

    if (condition) {
      item.active = true
    }
    return item
  })
}
