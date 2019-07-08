const { loadContent, loadList } = require('./load')

const processIncludes = ({ pagePath, contentDir }, key, value) => {
  if (key === 'content') {
    return loadContent({ rootDir: contentDir, contentPath: value, pagePath })
  } else if (key === 'list') {
    return loadList({ rootDir: contentDir, listGlob: value, pagePath })
  }
  return value
}

module.exports = processIncludes
