const { loadContent, loadList } = require('./load')

const processIncludes = ({ pagePath, contentDir }, key, value) => {
  const hasContent = key === 'content' || value.match(/\.(yml|md)$/)

  if (key === 'list') {
    return loadList({ rootDir: contentDir, listGlob: value, pagePath })
  } else if (hasContent) {
    return loadContent({ rootDir: contentDir, contentPath: value, pagePath })
  }

  return value
}

module.exports = processIncludes
