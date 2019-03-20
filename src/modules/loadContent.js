const path = require('path')
const { readYaml, readMarkdown } = require('./readContent')

const getAbsolutePath = (rootDir, contentPath, pagePath) => {
  if (contentPath.indexOf('~/') === 0) {
    return path.join(rootDir, contentPath.slice(2))
  }
  return path.join(rootDir, path.parse(pagePath).dir, contentPath)
}

const loadContent = ({ rootDir, contentPath, pagePath }) => {
  const source = getAbsolutePath(rootDir, contentPath, pagePath)

  if (source.match(/\.md$/)) {
    // TODO: remove slice
    return readMarkdown(source).slice(0, 100) + '...'
  } else if (source.match(/\.yml$/)) {
    return readYaml(source)
  }

  console.warn(`Unknown content type: ${source}. Skipping...`)
  return contentPath
}

module.exports = loadContent
