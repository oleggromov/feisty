const glob = require('glob')
const path = require('path')
const objectDeepMap = require('../modules/object-deep-map')
const { readYaml, readMarkdown } = require('../modules/read')
const markActiveItems = require('../modules/mark-active-items')
const clone = require('../modules/clone')

const getUrl = (rootDir, fullPath) => path.relative(rootDir, fullPath)
  .replace(/(\/)?index.yml/, '')
  .replace(/^(\/)?/, '/')

const createSourceTree = (pagePath, { pageUrl, foundImages = [] } = {}) => {
  const currentDir = path.parse(pagePath).dir
  const source = readYaml(pagePath)

  if (source.cover) {
    foundImages.push(source.cover)
    source.cover = path.join(pageUrl, source.cover)
  }

  return objectDeepMap(source, (key, value) => {
    const isString = typeof value === 'string'
    const isMarkdown = isString && value.match(/\.md$/)
    const isYaml = isString && value.match(/\.yml$/)
    const sourcePath = (isMarkdown || isYaml)
      ? path.resolve(currentDir, value)
      : ''

    if (isMarkdown) {
      return readMarkdown(sourcePath, { foundImages, baseImageUrl: pageUrl })
    } else if (isYaml) {
      return createSourceTree(sourcePath, { pageUrl })
    }

    return value
  })
}

const getPages = ({ sources, rootDir, foundImages }) => {
  // ToDo: add checks here
  const common = createSourceTree(path.join(rootDir, '../partials/common.yml'))

  return sources.map(fullPath => {
    const pageUrl = getUrl(rootDir, fullPath)

    foundImages[pageUrl] = []

    modifiedCommon = clone(common)
    modifiedCommon.menu.items = markActiveItems(modifiedCommon.menu.items, pageUrl)

    const pageData = createSourceTree(fullPath, {
      pageUrl,
      foundImages: foundImages[pageUrl]
    })
    const pageDataMeta = pageData.meta
    delete pageData.meta

    let relativeWritePath = fullPath
    if (pageDataMeta && pageDataMeta.writePath) {
      relativeWritePath = pageDataMeta.writePath
        .replace(/^~/, rootDir)
        .replace(/\.html$/, '.yml')
    }

    return {
      meta: {
        ...pageDataMeta,
        writePath: path.relative(rootDir, relativeWritePath).replace(/\.yml$/, '.json'),
        url: pageUrl
      },
      data: pageData,
      common: modifiedCommon
    }
  })
}

module.exports = getPages
