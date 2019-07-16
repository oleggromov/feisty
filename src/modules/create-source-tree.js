const objectDeepMap = require('./object-deep-map')
const { readYaml, readMarkdown } = require('./read')
const glob = require('glob')
const path = require('path')

const sortByPublished = (a, b) => {
  return new Date(b.published) - new Date(a.published)
}

const createSourceTree = (pagePath, { pageUrl, foundImages = [] } = {}) => {
  const currentDir = path.parse(pagePath).dir
  const source = readYaml(pagePath)

  return objectDeepMap(source, (key, value) => {
    const isMarkdown = value.match(/\.md$/)
    const isYaml = value.match(/\.yml$/)
    const isList = key === 'list'
    const sourcePath = (isMarkdown || isYaml || isList)
      ? path.resolve(currentDir, value)
      : ''

    if (isList) {
      return glob.sync(sourcePath)
        .map(fullPath => createSourceTree(fullPath, readYaml(fullPath)))
        .sort(sortByPublished)
    } else if (isMarkdown) {
      return readMarkdown(sourcePath, { foundImages, baseImageUrl: pageUrl })
    } else if (isYaml) {
      return createSourceTree(sourcePath, readYaml(sourcePath))
    }

    return value
  })
}

module.exports = createSourceTree
