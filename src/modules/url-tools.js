const resolveUrl = (url, base) => {
  if (url.match(/^(\w+:)?\/\//) || url.match(/^\//)) {
    return url
  }

  return base.replace(/\/?$/, '/') + url
}

const getIsInternal = (url) => {
  return url === '/' || Boolean(url.match(/^\/{1}\w+/))
}

module.exports = {
  resolveUrl,
  getIsInternal
}
