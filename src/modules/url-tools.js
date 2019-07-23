const resolveUrl = (url, base) => {
  if (url.match(/^(\w+:)?\/\//) || url.match(/^\//)) {
    return url
  }

  return base.replace(/\/?$/, '/') + url
}

const getIsInternal = (url) => {
  return Boolean(url.match(/^\/{1}\w+/))
}

module.exports = {
  resolveUrl,
  getIsInternal
}
