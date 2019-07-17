const path = require('path')
const glob = require('glob')
const createSourceTree = require('../modules/create-source-tree')
const markActiveItems = require('../modules/mark-active-items')
const clone = require('../modules/clone')

const getPages = ({ rootDir, foundImages }) => {
  // ToDo: add checks here
  const common = createSourceTree(`${rootDir}/common.yml`)

  return glob.sync(`${rootDir}/**/index.yml`)
    .map(fullPath => {
      const pageUrl = path.relative(rootDir, fullPath)
        .replace(/(\/)?index.yml/, '/')
        .replace(/^(\/)?/, '/')

      foundImages[pageUrl] = []

      modifiedCommon = clone(common)
      modifiedCommon.menu.items = markActiveItems(modifiedCommon.menu.items, pageUrl)

      return {
        meta: {
          writePath: path.relative(rootDir, fullPath)
            .replace(/\.yml$/, '.json'),
          url: pageUrl
        },
        data: createSourceTree(fullPath, {
          pageUrl,
          foundImages: foundImages[pageUrl]
        }),
        common: modifiedCommon
      }
    })
}

module.exports = getPages
