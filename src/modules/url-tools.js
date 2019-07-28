const resolveUrl = (url, base) => {
  if (url.match(/^(\w+:)?\/\//) || url.match(/^\//)) {
    return url
  }

  return base.replace(/\/?$/, '/') + url
}

const getIsInternal = (url) => {
  const isRoot = url === '/'
  const isHash = url.match(/^#/)
  const hasOneHash = url.match(/^\/{1}\w+/)
  return Boolean(isRoot || isHash || hasOneHash)
}

module.exports = {
  resolveUrl,
  getIsInternal
}
