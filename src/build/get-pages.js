const path = require('path')
const glob = require('glob')
const createSourceTree = require('../modules/create-source-tree')

const getPages = ({ rootDir, foundImages }) => {
  // ToDo: add checks here
  const common = createSourceTree(`${rootDir}/common.yml`)
  
  return glob.sync(`${rootDir}/**/index.yml`)
    .map(fullPath => {
      const pageUrl = path.relative(rootDir, fullPath)
        .replace(/(\/)?index.yml/, '/')
        .replace(/^(\/)?/, '/')

      foundImages[pageUrl] = []

      return {
        meta: {
          sourcePath: fullPath,
          writePath: path.relative(rootDir, fullPath)
            .replace(/\.yml$/, '.json'),
          url: pageUrl
        },
        data: createSourceTree(fullPath, {
          pageUrl,
          foundImages: foundImages[pageUrl]
        }),
        common
      }
    })
}

module.exports = getPages
