const path = require('path')
const glob = require('glob')
const createSourceTree = require('../modules/create-source-tree')

const getPages = ({ rootDir }) => {
  // ToDo: add checks here
  const common = createSourceTree(`${rootDir}/common.yml`)
  return glob.sync(`${rootDir}/**/index.yml`)
    .map(fullPath => ({
      meta: {
        sourcePath: fullPath,
        writePath: path.relative(rootDir, fullPath)
          .replace(/\.yml$/, '.json'),
        url: path.relative(rootDir, fullPath)
          .replace(/(\/)?index.yml/, '/')
          .replace(/^(\/)?/, '/')
      },
      data: createSourceTree(fullPath),
      common
    }))
}

module.exports = getPages
