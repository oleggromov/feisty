const objectDeepMap = require('./object-deep-map')
const { readYaml, readMarkdown } = require('./read')
const glob = require('glob')
const path = require('path')

const createSourceTree = (pagePath, common) => {
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
    } else if (isMarkdown) {
      return readMarkdown(sourcePath)
    } else if (isYaml) {
      return createSourceTree(sourcePath, readYaml(sourcePath))
    }

    return value
  })
}

module.exports = createSourceTree
