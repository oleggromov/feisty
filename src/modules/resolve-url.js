const resolveUrl = (url, base) => {
  if (url.match(/^(\w+:)?\/\//) || url.match(/^\//)) {
    return url
  }

  return base.replace(/\/?$/, '/') + url
}

module.exports = resolveUrl
