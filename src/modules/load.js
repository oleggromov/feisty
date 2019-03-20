const path = require('path')
const glob = require('glob')
const { readYaml, readMarkdown } = require('./readContent')

const getAbsolutePath = (rootDir, contentPath, pagePath) => {
  if (contentPath.indexOf('/') === 0) {
    return contentPath
  } else if (contentPath.indexOf('~/') === 0) {
    return path.join(rootDir, contentPath.slice(2))
  }
  return path.join(rootDir, path.parse(pagePath).dir, contentPath)
}

const loadContent = ({ rootDir, contentPath, pagePath }) => {
  const absPath = getAbsolutePath(rootDir, contentPath, pagePath)

  if (absPath.match(/\.md$/)) {
    return readMarkdown(absPath)
  } else if (absPath.match(/\.yml$/)) {
    return readYaml(absPath)
  }

  console.warn(`Unknown content type: ${absPath}. Skipping...`)
  return contentPath
}

const loadList = ({ rootDir, listGlob, pagePath }) => {
  const listPaths = glob.sync(getAbsolutePath(rootDir, listGlob, pagePath))

  return listPaths.reduce((acc, itemPath) => {
    const key = path.relative(rootDir, itemPath)
    // TODO: do we need to read the contents and lists again? 
    acc[key] = loadContent({ rootDir, contentPath: itemPath, pagePath })
    return acc
  }, {})
}

module.exports = {
  loadContent,
  loadList
}
